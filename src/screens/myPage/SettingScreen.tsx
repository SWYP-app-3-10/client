import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
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

/**
 * 설정 화면
 * - 로그인 정보
 * - 알림 설정 (토글)
 * - 약관 및 정책
 * - 문의하기
 */
const SettingScreen = () => {
  const navigation = useNavigation<any>(); // 네비게이션 객체
  const [isAlarmOn, setIsAlarmOn] = useState(false); // 알림 토글 상태

  // 화살표 있는 행 클릭 시 이동
  const goTo = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ===== 헤더 영역 ===== */}
      <View style={styles.headerWrap}>
        {/* 공통 헤더는 그대로 사용 (title은 비워서 기본 Text 출력 방지) */}
        <Header title="" />

        {/* 중앙 타이틀 오버레이 */}
        <View pointerEvents="none" style={styles.headerCenterTitleWrap}>
          <Text style={styles.headerCenterTitle}>설정</Text>
        </View>
      </View>

      {/* 전체 컨테이너 */}
      <View style={styles.container}>
        {/* ===== 회원 정보 ===== */}
        <Text style={styles.sectionLabel}>회원정보</Text>

        <Pressable
          style={styles.row}
          onPress={() => goTo(RouteNames.LOGIN_INFO)} // 로그인 정보
        >
          <Text style={styles.rowTitle}>로그인 정보</Text>
          <RightArrow />
        </Pressable>

        {/* ===== 알림 ===== */}
        <Text style={styles.sectionLabel}>알림</Text>

        {/* 알림 row는 스위치를 타이틀 라인에 맞춰야 해서 전용 스타일 사용 */}
        <View style={[styles.row, styles.alarmRow]}>
          <View>
            <Text style={styles.rowTitle}>알림 설정</Text>
            <Text style={styles.rowDesc}>
              아침 8시, 저녁 6시에 알림을 드려요.
            </Text>
          </View>

          <Switch
            style={[styles.alarmSwitch, styles.switchLarge]}
            value={isAlarmOn}
            onValueChange={setIsAlarmOn}
            trackColor={{
              false: COLORS.gray300,
              true: COLORS.puple.main,
            }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* ===== 약관 및 정책 ===== */}
        <Text style={styles.sectionLabel}>약관 및 정책</Text>

        {/* 서비스 이용 약관 */}
        <Pressable
          style={[styles.row, styles.rowNoBorder]}
          onPress={() => goTo(RouteNames.TERMS_OF_SERVICE)}
        >
          <Text style={styles.rowTitle}>서비스 이용 약관</Text>
          <RightArrow />
        </Pressable>

        {/* 개인정보 처리 방침 */}
        <Pressable
          style={styles.row}
          // onPress={() => goTo(RouteNames.PRIVACY_POLICY)}
        >
          <Text style={styles.rowTitle}>개인정보 처리 방침</Text>
          <RightArrow />
        </Pressable>

        {/* ===== 도움말 ===== */}
        <Text style={styles.sectionLabel}>도움말</Text>

        {/* 문의하기 */}
        <Pressable
          style={[styles.row, styles.rowNoBorder]}
          onPress={() => goTo(RouteNames.INQUIRY)}
        >
          <Text style={styles.rowTitle}>문의하기</Text>
          <RightArrow />
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

  // 헤더 래퍼 (중앙 타이틀 오버레이 기준)
  headerWrap: {
    position: 'relative',
  },

  // 헤더 중앙 타이틀 오버레이 래퍼
  headerCenterTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: scaleWidth(8),
    height: scaleWidth(52),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 헤더 중앙 타이틀 텍스트
  headerCenterTitle: {
    ...Heading_16B,
    color: COLORS.black,
  },

  container: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(5),
  },

  // 섹션 라벨
  sectionLabel: {
    ...Caption_14R,
    color: COLORS.gray700,
    marginTop: scaleWidth(24),
    marginBottom: scaleWidth(12),
  },

  // 설정 row (기본: 구분선 있음)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleWidth(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },

  // 알림 row 전용 (스위치가 타이틀 라인에 오도록 + 아래 패딩 24)
  alarmRow: {
    alignItems: 'flex-start',
    paddingTop: scaleWidth(16),
    paddingBottom: scaleWidth(24),
  },

  // 알림 스위치 전용 (상단 정렬)
  alarmSwitch: {
    alignSelf: 'flex-start',
  },

  // 아래 구분선 제거용 row
  rowNoBorder: {
    borderBottomWidth: 0,
  },

  // row 제목
  rowTitle: {
    ...Body_16SB,
    color: COLORS.black,
  },

  // 아침 8시 저녁 6시.. 텍스트
  rowDesc: {
    ...Caption_14R,
    color: COLORS.gray700,
    marginTop: scaleWidth(4),
  },

  // 토글 크기 조절 (56 x 34 비율)
  // TODO 커스텀 컴포넌트로 변경해야 함. 현재 사용 중인 RN 기본 스위치는 크기/모양 변경이 제한적임
  switchLarge: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
