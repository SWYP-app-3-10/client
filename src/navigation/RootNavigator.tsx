import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';
import {useModalState, useModalStore} from '../store/modalStore';
import {useIsOnboardingCompleted} from '../store/onboardingStore';
import NotificationModal from '../components/NotificationModal';

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  // zustand: modalState만 구독 (리렌더링 최적화)
  const modalState = useModalState();
  const hideModal = useModalStore(state => state.hideModal);
  // zustand: 온보딩 완료 상태만 구독 (리렌더링 최적화)
  const isOnboardingCompleted = useIsOnboardingCompleted();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isOnboardingCompleted ? (
          // 온보딩 스택 (소셜 로그인 포함)
          <Stack.Screen
            name={RouteNames.ONBOARDING}
            component={OnboardingNavigator}
          />
        ) : (
          // 메인 스택 (온보딩 완료 후)
          <Stack.Screen
            name={RouteNames.MAIN_TAB}
            component={MainTabNavigator}
          />
        )}
      </Stack.Navigator>
      {/* 전역 모달 */}
      <NotificationModal
        visible={modalState.visible}
        title={modalState.title}
        description={modalState.description}
        image={modalState.image}
        imageSize={modalState.imageSize}
        primaryButton={{
          ...modalState.primaryButton,
          onPress: () => {
            modalState.primaryButton.onPress();
            hideModal();
          },
        }}
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
        onClose={hideModal}>
        {modalState.children}
      </NotificationModal>
    </NavigationContainer>
  );
};

export default RootNavigator;
