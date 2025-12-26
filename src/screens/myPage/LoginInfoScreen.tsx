import React from 'react'; // 리액트
import { View, Text, StyleSheet, Pressable } from 'react-native'; // RN 기본 컴포넌트
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeArea 대응
//import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅

import Header from '../../components/Header'; // 공통 헤더
//import IconButton from '../../components/IconButton'; // 아이콘 버튼 (향후 확장용)

import { COLORS, scaleWidth } from '../../styles/global'; // 디자인 시스템

/**
 * 로그인 정보 화면
 * - 로그아웃
 * - 서비스 탈퇴
 */
const LoginInfoScreen = () => {
  //const navigation = useNavigation<any>(); // 네비게이션 객체

  /**
   * 로그아웃 클릭
   * - TODO: 실제 로그아웃 로직(토큰 삭제/스토어 초기화/로그인 화면 이동) 연결
   */
  const onPressLogout = () => {
    console.log('[LoginInfo] logout pressed'); // 디버그 로그
    // 예) authStore.logout(); navigation.reset(...)
  };

  /**
   * 서비스 탈퇴 클릭
   * - TODO: 확인 모달 띄우고, 서버 탈퇴 API 호출 후 로그아웃 처리
   */
  const onPressWithdraw = () => {
    console.log('[LoginInfo] withdraw pressed'); // 디버그 로그
    // 예) showModal({title:'탈퇴하시겠어요?', ...})
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <Header title="로그인 정보" />

      {/* 전체 컨테이너 */}
      <View style={styles.container}>
        {/* 로그아웃 */}
        <Pressable style={styles.row} onPress={onPressLogout}>
          <Text style={styles.rowTitle}>로그아웃</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {/* 서비스 탈퇴 */}
        <Pressable style={styles.row} onPress={onPressWithdraw}>
          <Text style={styles.rowTitle}>서비스 탈퇴</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LoginInfoScreen;

/* =========================
   스타일
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1, // 화면 전체 차지
    backgroundColor: COLORS.white, // 배경 흰색
  },
  container: {
    paddingHorizontal: scaleWidth(20), // 좌우 패딩
    paddingTop: scaleWidth(8), // 상단 패딩 (헤더 아래 여백)
  },
  row: {
    flexDirection: 'row', // 가로 정렬
    justifyContent: 'space-between', // 좌우 끝 정렬
    alignItems: 'center', // 수직 가운데 정렬
    paddingVertical: scaleWidth(16), // 상하 패딩
    borderBottomWidth: 1, // 하단 보더 두께
    borderBottomColor: COLORS.gray100, // 하단 보더 색상
  },
  rowTitle: {
    fontSize: scaleWidth(16), // 제목 폰트 크기
    color: COLORS.black, // 텍스트 색상
    fontWeight: '500', // 폰트 두께
  },
  arrow: {
    fontSize: scaleWidth(18), // 화살표 크기
    color: COLORS.gray300, // 화살표 색상
  },
});
