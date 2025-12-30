import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import RightArrow from '../../assets/svg/RightArrow.svg';
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

/**
 * 설정 화면
 * - 로그인 정보
 * - 알림 설정 (토글)
 * - 약관 및 정책
 * - 문의하기
 */
const SettingScreen = () => {
  const navigation = useNavigation<any>();
  const [isAlarmOn, setIsAlarmOn] = useState(false);

  const showModal = useShowModal();
  const { checkPermission, requestPermission } = useNotificationPermission();

  useEffect(() => {
    /**
     * 초기 진입 시 권한 상태를 보고 토글 상태를 맞춰둠
     * - checkPermission()이 "모달을 띄워야 하는 상태(권한 미허용/미결정 등)"면 true를 반환
     * - 즉, shouldShowModal=true => 아직 권한이 확정적으로 허용된 상태가 아니므로 토글 OFF
     * - shouldShowModal=false => 이미 허용된 상태로 보고 토글 ON
     */
    const syncAlarmToggle = async () => {
      try {
        const shouldShowModal = await checkPermission();
        setIsAlarmOn(!shouldShowModal);
      } catch (e) {
        // 실패 시 기존 값 유지
      }
    };

    syncAlarmToggle();
  }, [checkPermission]);

  /**
   * "알림 설정" row 탭 시 동작
   * 1) 앱 모달(안내) -> 2) OS 권한 팝업 -> 3) 결과에 따라 토글 반영
   */
  const handlePressAlarmRow = async () => {
    // 이미 ON 상태면: UX 상 "행 탭"으로 OFF 처리만 해도 충분
    // (권한 자체를 끄는 건 OS 설정에서)
    if (isAlarmOn) {
      setIsAlarmOn(false);
      return;
    }

    try {
      const shouldShowModal = await checkPermission();

      if (shouldShowModal) {
        showModal({
          image: <></>,
          title: '알림을 받으시겠어요?',
          description:
            '알림을 켜두면, 하루 두 번 문해력 루틴을 \n잊지 않고 챙길 수 있어요!',
          descriptionColor: COLORS.gray600,
          // ✅ LoginScreen 알림 모달과 동일한 스타일
          primaryButton: {
            title: '알림 받을래요',
            textStyle: { ...Heading_16B, color: COLORS.white },
            onPress: async () => {
              const granted = await requestPermission();

              // 권한 결과에 따라 토글 반영
              setIsAlarmOn(!!granted);

              if (!granted) {
                Alert.alert(
                  '알림이 꺼져 있어요',
                  '기기 설정에서 알림 권한을 허용하면 사용할 수 있어요.',
                );
              }
            },
          },

          // ✅ LoginScreen 알림 모달과 동일한 스타일
          secondaryButton: {
            title: '괜찮아요',
            variant: 'outline',
            textStyle: { color: COLORS.gray700, ...Heading_16B },
            style: {
              borderColor: COLORS.gray300,
              height: scaleWidth(48),
            },
            onPress: async () => {
              // 사용자가 거절하면 토글 OFF 유지
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
      {/* ===== 헤더 ===== */}
      <View style={styles.headerWrap}>
        <Header title="" />
        <View pointerEvents="none" style={styles.headerCenterTitleWrap}>
          <Text style={styles.headerCenterTitle}>설정</Text>
        </View>
      </View>

      {/* ===== 컨텐츠 ===== */}
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

        {/* row 자체를 누르면 모달 -> OS 권한 -> 토글 반영 */}
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

          {/* 스위치는 표시/반영만 담당 */}
          <Switch
            style={[styles.alarmSwitch, styles.switchLarge]}
            value={isAlarmOn}
            onValueChange={handlePressAlarmRow}
            trackColor={{
              false: COLORS.gray300,
              true: COLORS.puple.main,
            }}
            thumbColor={COLORS.white}
          />
        </Pressable>

        <View style={styles.divider} />

        {/* 약관 */}
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

/* =========================
  스타일
========================= */
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

  // row는 레이아웃만 담당
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleWidth(12),
  },

  // 구분선 전용 스타일
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
