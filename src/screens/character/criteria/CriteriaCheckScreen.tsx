// CriteriaCheckScreen.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import LevelCriteriaScreen from './level/LevelCriteriaScreen';
import PointCriteriaScreen from './expAndPoint/PointCriteriaScreen';

// 공통 디자인 시스템
import {
  COLORS,
  BORDER_RADIUS,
  scaleWidth,
  Heading_16B,
  Body_16SB,
} from '../../../styles/global';

/** 상단 세그먼트 탭 키 */
type TabKey = 'LEVEL' | 'POINT';

/**
 * CriteriaCheckScreen
 *
 * - "기준 확인하기" 진입 화면
 * - 상단: 뒤로가기 + 타이틀 헤더
 * - 중단: 세그먼트 탭(레벨 / 경험치·포인트)
 * - 하단: 탭에 따라 LevelCriteriaScreen 또는 PointCriteriaScreen 렌더링
 */
const CriteriaCheckScreen = () => {
  /** 내비게이션(뒤로가기) */
  const navigation = useNavigation<any>();

  /** 현재 선택된 탭 상태 */
  const [tab, setTab] = useState<TabKey>('LEVEL');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        {/* 뒤로가기 버튼 */}
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        {/* 화면 타이틀 */}
        <Text style={styles.headerTitle}>기준 확인하기</Text>

        {/* 우측 정렬용 빈 공간(타이틀 중앙 정렬 유지) */}
        <View style={styles.headerRightSpace} />
      </View>

      {/* 세그먼트 탭 */}
      <View style={styles.segmentWrap}>
        {/* 레벨 탭 */}
        <Pressable
          onPress={() => setTab('LEVEL')}
          style={[
            styles.segmentBtn,
            tab === 'LEVEL' && styles.segmentBtnActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              tab === 'LEVEL' && styles.segmentTextActive,
            ]}
          >
            레벨
          </Text>
        </Pressable>

        {/* 경험치/포인트 탭 */}
        <Pressable
          onPress={() => setTab('POINT')}
          style={[
            styles.segmentBtn,
            tab === 'POINT' && styles.segmentBtnActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              tab === 'POINT' && styles.segmentTextActive,
            ]}
          >
            경험치 / 포인트
          </Text>
        </Pressable>
      </View>

      {/* 탭별 콘텐츠 영역 */}
      <View style={styles.body}>
        {tab === 'LEVEL' ? <LevelCriteriaScreen /> : <PointCriteriaScreen />}
      </View>
    </SafeAreaView>
  );
};

export default CriteriaCheckScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체 높이 차지
    backgroundColor: COLORS.white, // 화면 배경색(디자인 시스템)
    paddingHorizontal: scaleWidth(20), // 컨텐츠 좌우 기준 여백(폭 정렬 통일)
  },

  header: {
    height: scaleWidth(52), // 헤더 높이
    flexDirection: 'row', // 좌(뒤로) 중(타이틀) 우(스페이서) 가로 배치
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'space-between', // 좌/중/우 간격 균등 배치
  },

  backBtn: {
    width: scaleWidth(48), // 터치 영역 너비
    height: scaleWidth(48), // 터치 영역 높이
    justifyContent: 'center', // 아이콘 세로 중앙
    alignItems: 'flex-start', // 아이콘 왼쪽 정렬
  },

  back: {
    fontSize: scaleWidth(20), // 뒤로가기 아이콘 크기
    color: COLORS.black, // 아이콘 색상
  },

  headerTitle: {
    ...Heading_16B, // 타이틀 타이포
    color: COLORS.black, // 타이틀 색상
  },

  headerRightSpace: {
    width: scaleWidth(48), // 우측 스페이서(타이틀 중앙 유지, 뒤로가기 버튼과 동일 너비)
  },

  segmentWrap: {
    marginTop: scaleWidth(8), // ■ TODO 헤더와 간격
    height: scaleWidth(52), // 세그먼트 높이
    borderRadius: BORDER_RADIUS[12], // 세그먼트 라운드
    backgroundColor: COLORS.gray100, // 세그먼트 배경색
    flexDirection: 'row', // 버튼 2개 가로 배치
    padding: scaleWidth(8), // 세그먼트 내부 여백 (피그마 -> (52-36)/2 = 8)
  },

  segmentBtn: {
    flex: 1, // 버튼이 반반 영역 차지
    borderRadius: BORDER_RADIUS[10] ?? scaleWidth(10), // 버튼 라운드(토큰 없으면 스케일)
    justifyContent: 'center', // 텍스트 세로 중앙
    alignItems: 'center', // 텍스트 가로 중앙
  },

  segmentBtnActive: {
    backgroundColor: COLORS.white, // 활성 버튼 배경색
  },

  segmentText: {
    ...Body_16SB, // 텍스트 타이포
    color: COLORS.gray500, // 비활성 텍스트 색상
  },

  segmentTextActive: {
    color: COLORS.black, // 활성 텍스트 색상
  },

  body: {
    flex: 1, // 남은 영역 전체 사용
    marginTop: scaleWidth(0), // 세그먼트와 컨텐츠 간격 -> 탭 별로 크기 다름
  },
});
