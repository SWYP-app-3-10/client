import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Header from '../../components/Header';
import RightArrow from '../../assets/svg/RightArrow.svg';
import Toast from '../../components/Toast';
import Toggle from '../../components/Toggle';

import {
  COLORS,
  scaleWidth,
  Heading_16B,
  Caption_14R,
  Body_16SB,
} from '../../styles/global';
import { RouteNames } from '../../../routes';

import { useShowModal } from '../../store/modalStore';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';

// Toast store
import { useToastMessage, useClearToast } from '../../store/toastStore'; // 경로 맞게

/**
 * SettingScreen
 *
 * 역할
 * - 설정 섹션(회원정보/알림/약관/도움말) 메뉴 진입
 * - 알림 토글은 "권한 상태"를 기반으로 UI를 동기화
 *
 * 알림 토글 UX 정책
 * - 토글 ON 시: 안내 모달 → OS 권한 요청 → 결과에 따라 토글 반영
 * - 토글 OFF 시: 앱 내부에서 OFF 처리만(권한 자체 OFF는 OS 설정에서)
 */
const SettingScreen = () => {
  const navigation = useNavigation<any>();

  // 화면에 표시되는 알림 토글 상태
  const [isAlarmOn, setIsAlarmOn] = useState(false);

  // 토스트 로컬 상태(컴포넌트에서 표시 제어)
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // toastStore에서 메시지 읽기/초기화
  const storedToastMessage = useToastMessage();
  const clearToast = useClearToast();

  // 공통 모달 호출(Store 기반)
  const showModal = useShowModal();

  // 설정 대기 상태 추적
  const waitingForSettingsRef = useRef(false);

  // 권한 상태 확인/요청 훅
  const { checkPermission, requestPermission } = useNotificationPermission({
    onSettingsOpened: () => {
      waitingForSettingsRef.current = true;
    },
  });

  // 화면 포커스 시, store에 메시지가 있으면 토스트로 표시 후 제거
  // 그리고 권한 상태 확인하여 토글 동기화
  useFocusEffect(
    useCallback(() => {
      // 토스트 메시지 처리
      if (storedToastMessage) {
        setToastMessage(storedToastMessage);
        setToastVisible(true);
        clearToast();
      }

      // 권한 상태 확인하여 토글 동기화
      // (초기 진입 시, 설정에서 돌아왔을 때 모두 처리)
      const syncAlarmToggle = async () => {
        try {
          const shouldShowModal = await checkPermission();
          setIsAlarmOn(!shouldShowModal);
        } catch (e) {
          // 실패 시 기존 토글 상태 유지
        }
      };

      syncAlarmToggle();
    }, [storedToastMessage, clearToast, checkPermission]),
  );

  // 토스트 종료 콜백
  const handleHideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  /**
   * 알림 설정 Row(또는 Switch) 클릭 시 동작
   *
   * 1) 현재 ON이면: 앱 UI에서만 OFF 처리
   * 2) 현재 OFF이면:
   *    - 권한이 필요하면: 안내 모달 → OS 권한 요청 → 결과 반영
   *    - 이미 허용이면: 바로 ON 처리
   */
  const handlePressAlarmRow = async () => {
    // 이미 ON 상태면, UX 상 "OFF" 처리만 해도 충분
    // (권한 자체 OFF는 사용자가 OS 설정에서)
    if (isAlarmOn) {
      setIsAlarmOn(false);
      return;
    }

    try {
      const shouldShowModal = await checkPermission();

      if (shouldShowModal) {
        // 권한 요청이 필요한 상태 → 안내 모달 노출 후, 사용자가 동의하면 OS 권한 팝업 요청
        showModal({
          image: <></>,
          title: '알림을 받으시겠어요?',
          description:
            '알림을 켜두면, 하루 두 번 문해력 루틴을 \n잊지 않고 챙길 수 있어요!',
          descriptionColor: COLORS.gray600,
          primaryButton: {
            title: '알림 받을래요',
            textStyle: { ...Heading_16B, color: COLORS.white },
            onPress: async () => {
              const granted = await requestPermission();

              // OS 권한 결과에 따라 토글 반영

              setIsAlarmOn(!!granted);
            },
          },

          secondaryButton: {
            title: '괜찮아요',
            variant: 'outline',
            textStyle: { color: COLORS.gray700, ...Heading_16B },
            style: {
              borderColor: COLORS.gray300,
              height: scaleWidth(48),
            },
            onPress: async () => {
              // 사용자가 모달에서 거절한 경우 토글 OFF 유지
              setIsAlarmOn(false);
            },
          },
        });
      } else {
        // 이미 권한이 허용된 상태로 판단되면 바로 토글 ON
        setIsAlarmOn(true);
      }
    } catch (error: any) {
      Alert.alert(
        '오류',
        error?.message || '알림 설정 중 오류가 발생했습니다.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* 토스트 (설정 화면 위에 오버레이) */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        duration={1500}
        onHide={handleHideToast}
      />

      {/* 상단 헤더: 공통 Header + 가운데 타이틀(설정) 오버레이 */}
      <View style={styles.headerWrap}>
        <Header title="" />
        <View pointerEvents="none" style={styles.headerCenterTitleWrap}>
          <Text style={styles.headerCenterTitle}>설정</Text>
        </View>
      </View>

      {/* 섹션별 메뉴 리스트 */}
      <View style={styles.container}>
        {/* 회원정보 */}
        <Text style={styles.sectionLabel}>회원정보</Text>
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate(RouteNames.LOGIN_INFO)}
        >
          <Text style={styles.rowTitle}>로그인 정보</Text>
          <RightArrow color={COLORS.gray700} />
        </Pressable>
        <View style={styles.divider} />

        {/* 알림 */}
        <Text style={styles.sectionLabel}>알림</Text>

        {/* Row 전체를 누르면: 모달 → OS 권한 → 토글 반영 */}
        <Pressable
          style={[styles.row, styles.alarmRow]}
          onPress={handlePressAlarmRow}
        >
          <View>
            <Text style={styles.rowTitle}>알림 설정</Text>
            <Text style={styles.rowDesc}>
              아침 8시, 저녁 6시에 알림을 드려요.
            </Text>
          </View>

          {/* Toggle은 "표시/트리거" 역할만 (권한 흐름은 동일 handler로 통합) */}
          <Toggle value={isAlarmOn} onChange={() => handlePressAlarmRow()} />
        </Pressable>

        <View style={styles.divider} />

        {/* 약관 및 정책 */}
        <Text style={styles.sectionLabel}>약관 및 정책</Text>
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate(RouteNames.TERMS_OF_SERVICE)}
        >
          <Text style={styles.rowTitle}>서비스 이용 약관</Text>
          <RightArrow color={COLORS.gray700} />
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate(RouteNames.PRIVACY_POLICY)}
        >
          <Text style={styles.rowTitle}>개인정보 처리 방침</Text>
          <RightArrow color={COLORS.gray700} />
        </Pressable>
        <View style={styles.divider} />

        {/* 도움말 */}
        <Text style={styles.sectionLabel}>도움말</Text>
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate(RouteNames.INQUIRY)}
        >
          <Text style={styles.rowTitle}>문의하기</Text>
          <RightArrow color={COLORS.gray700} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerWrap: {
    position: 'relative',
  },

  headerCenterTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: scaleWidth(8),
    height: scaleWidth(52),
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenterTitle: {
    ...Heading_16B,
    color: COLORS.black,
  },

  container: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(5),
  },

  sectionLabel: {
    ...Caption_14R,
    color: COLORS.gray700,
    marginTop: scaleWidth(24),
    marginBottom: scaleWidth(12),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleWidth(12),
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginTop: scaleWidth(12),
  },

  alarmRow: {
    alignItems: 'flex-start',
    paddingTop: scaleWidth(16),
  },

  alarmSwitch: {
    alignSelf: 'flex-start',
  },

  rowTitle: {
    ...Body_16SB,
    color: COLORS.black,
  },

  rowDesc: {
    ...Caption_14R,
    color: COLORS.gray700,
    marginTop: scaleWidth(8),
  },

  switchLarge: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
