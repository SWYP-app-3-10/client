import React, { useState, useCallback } from 'react';
import { Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';

import Header from '../../components/Header';
import { Body_16SB, COLORS, scaleWidth } from '../../styles/global';
import RightArrow from '../../assets/svg/RightArrow.svg';

// 공통 모달
import NotificationModal from '../../components/NotificationModal';

import { RouteNames } from '../../../routes';
import { clearAllAuthData } from '../../services/authService';
import { useOnboardingStore } from '../../store/onboardingStore';

/**
 * 로그인 정보 화면
 * - 로그아웃
 * - 서비스 탈퇴
 */
const LoginInfoScreen = () => {
  const navigation = useNavigation<any>();

  // 로그아웃 모달 상태
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);

  /** 로그아웃 클릭 */
  const onPressLogout = () => {
    console.log('[LoginInfo] logout pressed');
    setLogoutModalVisible(true);
  };

  /** 취소 */
  const onCancelLogout = () => {
    console.log('[LoginInfo] logout canceled');
    setLogoutModalVisible(false);
  };

  /** 확인 */
  const onConfirmLogout = useCallback(async () => {
    console.log('[LoginInfo] logout confirmed');
    setLogoutModalVisible(false);

    try {
      // 1) 로컬 인증/유저데이터 초기화
      await clearAllAuthData();

      // 2) 온보딩 스토어/스토리지 초기화 (currentStep -> login)
      await resetOnboarding();

      // 3) 네비게이션 스택 리셋 -> 온보딩으로 이동
      //    (OnboardingNavigator가 currentStep 기반으로 SOCIAL_LOGIN을 초기 라우트로 선택)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: RouteNames.ONBOARDING }],
        }),
      );
    } catch (e: any) {
      Alert.alert('오류', e?.message || '로그아웃 중 오류가 발생했습니다.');
    }
  }, [navigation, resetOnboarding]);

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="로그인 정보" />

      {/* 로그아웃 (divider 있음) */}
      <Pressable
        style={[styles.row, styles.rowWithDivider]}
        onPress={onPressLogout}
      >
        <Text style={styles.rowTitle}>로그아웃</Text>
        <RightArrow color={COLORS.gray700} />
      </Pressable>

      {/* 서비스 탈퇴 (divider 없음) */}
      <Pressable style={styles.row}>
        <Text style={styles.rowTitle}>서비스 탈퇴</Text>
        <RightArrow color={COLORS.gray700} />
      </Pressable>

      {/* 로그아웃 확인 모달 */}
      <NotificationModal
        visible={logoutModalVisible}
        title="로그아웃"
        description="정말 로그아웃하시겠어요?"
        closeButton
        onClose={onCancelLogout}
        closeOnBackdropPress={true}
        secondaryButton={{
          title: '취소',
          onPress: onCancelLogout,
        }}
        primaryButton={{
          title: '확인',
          onPress: onConfirmLogout,
          variant: 'primary',
        }}
      />
    </SafeAreaView>
  );
};

export default LoginInfoScreen;

/* =========================
  스타일
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  row: {
    height: scaleWidth(64),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scaleWidth(20),
  },
  // 로그아웃 아래에만 divider
  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  rowTitle: {
    ...Body_16SB,
    color: COLORS.black,
    fontWeight: '500',
  },
});
