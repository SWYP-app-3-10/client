import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { RouteNames } from '../../routes';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';
import FullScreenStackNavigator from './FullScreenStackNavigator';
import {
  useModalState,
  useModalStore,
  useShowModal,
} from '../store/modalStore';
import { useIsOnboardingCompleted } from '../store/onboardingStore';
import NotificationModal from '../components/NotificationModal';
import BottomSheetModal from '../components/BottomSheetModal';
import SearchStackNavigator from './SearchStackNavigator';
import { useExperienceStore } from '../store/experienceStore';
import { useCharacterData } from '../hooks/useCharacter';
import { LevelUpModalContent } from '../components/ArticlePointModalContent';

const Stack = createNativeStackNavigator();

// 내부 컴포넌트: 네비게이션 접근을 위해 필요
const RootNavigatorContent: React.FC<{
  navigationRef: React.RefObject<any>;
}> = ({ navigationRef }) => {
  // zustand: modalState만 구독 (리렌더링 최적화)
  const modalState = useModalState();
  const hideModal = useModalStore(state => state.hideModal);
  const showModal = useShowModal();
  // zustand: 온보딩 완료 상태만 구독 (리렌더링 최적화)
  const isOnboardingCompleted = useIsOnboardingCompleted();
  // 경험치와 레벨 데이터 감시
  const { experience } = useExperienceStore();
  const { data: characterData } = useCharacterData();
  const lastCheckedExpRef = useRef<number>(0);
  const hasShownLevelUpModalRef = useRef<boolean>(false);
  const prevOnboardingCompletedRef = useRef<boolean>(false);

  // 온보딩 완료 시 메인 화면으로 자동 전환
  useEffect(() => {
    if (
      isOnboardingCompleted &&
      !prevOnboardingCompletedRef.current &&
      navigationRef.current
    ) {
      // 온보딩이 완료되었고, 이전에는 완료되지 않았던 경우
      navigationRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: RouteNames.MAIN_TAB }],
        }),
      );
    }
    prevOnboardingCompletedRef.current = isOnboardingCompleted;
  }, [isOnboardingCompleted, navigationRef]);

  // 레벨업 체크: 경험치가 다음 레벨 경험치에 도달했는지 확인
  useEffect(() => {
    // 온보딩이 완료되지 않았거나 데이터가 없으면 체크하지 않음
    if (!isOnboardingCompleted || !characterData) {
      return;
    }

    const currentExp = experience;
    const nextLevelExp = characterData.nextLevelExp;
    const previousExp = lastCheckedExpRef.current;

    // 이전 경험치가 다음 레벨 경험치 미만이었고, 현재 경험치가 도달했을 때 레벨업
    if (
      previousExp < nextLevelExp &&
      currentExp >= nextLevelExp &&
      !hasShownLevelUpModalRef.current
    ) {
      // 레벨업 모달 표시
      const newLevel = characterData.currentLevel + 1;
      showModal({
        title: '축하해요! 레벨 업!',
        titleDescriptionGapSize: 4,
        description: '조금씩 생각이 자라나고 있어요.',
        children: React.createElement(LevelUpModalContent, {
          newLevel,
        }),
        primaryButton: {
          title: '확인',
          onPress: () => {
            // 모달 닫기
          },
        },
      });

      hasShownLevelUpModalRef.current = true;
    }

    // 경험치가 다음 레벨 경험치보다 낮아지면 (레벨업 후 리셋 등) 플래그 리셋
    if (currentExp < nextLevelExp) {
      hasShownLevelUpModalRef.current = false;
    }

    // 마지막 체크한 경험치 업데이트
    lastCheckedExpRef.current = currentExp;
  }, [experience, characterData, isOnboardingCompleted, showModal]);

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          isOnboardingCompleted ? RouteNames.MAIN_TAB : RouteNames.ONBOARDING
        }
      >
        {/* 온보딩 스택 (소셜 로그인 포함) - 온보딩 완료 후에도 편집을 위해 접근 가능 */}
        <Stack.Screen
          name={RouteNames.ONBOARDING}
          component={OnboardingNavigator}
        />
        {isOnboardingCompleted && (
          <>
            {/* 메인 스택 (온보딩 완료 후) */}
            <Stack.Screen
              name={RouteNames.MAIN_TAB}
              component={MainTabNavigator}
            />
            <Stack.Screen
              name={RouteNames.SEARCH_TAB}
              component={SearchStackNavigator}
            />
            {/* 전체 화면 스택 (탭바 없는 화면들: 알림, 설정 등) */}
            <Stack.Screen
              name={RouteNames.FULL_SCREEN_STACK}
              component={FullScreenStackNavigator}
            />
          </>
        )}
      </Stack.Navigator>
      {/* 전역 모달 */}
      {modalState.type === 'notification' && (
        <NotificationModal
          visible={modalState.visible}
          title={modalState.title}
          description={modalState.description}
          image={modalState.image}
          imageSize={modalState.imageSize}
          closeButton={modalState.closeButton}
          titleDescriptionGapSize={modalState.titleDescriptionGapSize}
          descriptionColor={modalState.descriptionColor}
          titleStyle={modalState.titleStyle}
          closeOnBackdropPress={modalState.closeOnBackdropPress}
          primaryButton={
            modalState.primaryButton
              ? {
                  ...modalState.primaryButton,
                  onPress: () => {
                    modalState.primaryButton?.onPress();
                    hideModal();
                  },
                }
              : undefined
          }
          secondaryButton={
            modalState.secondaryButton
              ? {
                  ...modalState.secondaryButton,
                  onPress: () => {
                    modalState.secondaryButton?.onPress();
                    hideModal();
                  },
                }
              : undefined
          }
          onClose={hideModal}
        >
          {modalState.children}
        </NotificationModal>
      )}
      {modalState.type === 'bottomSheet' && (
        <BottomSheetModal
          visible={modalState.visible}
          onClose={hideModal}
          paddingHorizontal={modalState.paddingHorizontal}
        >
          {modalState.children}
        </BottomSheetModal>
      )}
    </>
  );
};

const RootNavigator: React.FC = () => {
  const navigationRef = React.useRef<any>(null);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigatorContent navigationRef={navigationRef} />
    </NavigationContainer>
  );
};

export default RootNavigator;
