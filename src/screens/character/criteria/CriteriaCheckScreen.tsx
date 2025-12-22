import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import LevelCriteriaScreen from './level/LevelCriteriaScreen';
import PointCriteriaScreen from './expAndPoint/PointCriteriaScreen';

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
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        {/* 뒤로가기 버튼 */}
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        {/* 화면 타이틀 */}
        <Text style={styles.headerTitle}>기준 확인하기</Text>

        {/* 우측 정렬용 빈 공간(타이틀 중앙 정렬 유지) */}
        <View style={{ width: 24 }} />
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
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 24 },
  back: { fontSize: 20 },
  headerTitle: { fontSize: 16, fontWeight: '700' },

  segmentWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F2F3F5',
    flexDirection: 'row',
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: '#fff' },
  segmentText: { fontSize: 13, color: '#9AA0A6', fontWeight: '700' },
  segmentTextActive: { color: '#111' },

  body: { flex: 1, paddingTop: 8 },
});
