import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';
import { COLORS, scaleWidth } from '../../styles/global';
import RightArrow from '../../assets/svg/RightArrow.svg';

// ✅ 공통 모달
import NotificationModal from '../../components/NotificationModal';

/**
 * 로그인 정보 화면
 * - 로그아웃
 * - 서비스 탈퇴
 */
const LoginInfoScreen = () => {
  // 로그아웃 모달 상태
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  /**
   * 로그아웃 클릭 → 모달 오픈
   */
  const onPressLogout = () => {
    console.log('[LoginInfo] logout pressed');
    setLogoutModalVisible(true);
  };

  /**
   * 취소 버튼
   */
  const onCancelLogout = () => {
    console.log('[LoginInfo] logout canceled');
    setLogoutModalVisible(false);
  };

  /**
   * 확인 버튼
   */
  const onConfirmLogout = () => {
    console.log('[LoginInfo] logout confirmed');
    setLogoutModalVisible(false);

    // TODO: 실제 로그아웃 로직
    // 예) authStore.logout();
    // navigation.reset(...)
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="로그인 정보" />

      <View style={styles.container}>
        {/* 로그아웃 */}
        <Pressable style={styles.row} onPress={onPressLogout}>
          <Text style={styles.rowTitle}>로그아웃</Text>
          <RightArrow color={COLORS.gray700} />
        </Pressable>

        {/* 서비스 탈퇴 */}
        <Pressable style={styles.row}>
          <Text style={styles.rowTitle}>서비스 탈퇴</Text>
          <RightArrow color={COLORS.gray700} />
        </Pressable>
      </View>

      {/* ✅ 로그아웃 확인 모달 */}
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
  container: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleWidth(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  rowTitle: {
    fontSize: scaleWidth(16),
    color: COLORS.black,
    fontWeight: '500',
  },
});
