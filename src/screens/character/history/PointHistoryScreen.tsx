import React, { useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  pointHistoryMock,
  PointHistoryItem,
} from '../../../data/mock/characterData';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * PointHistoryScreen
 *
 * - "받은 내역"만 보여주는 화면
 * - 사용/차감(0 또는 음수)은 제외하고 적립/획득 내역만 리스트로 표시
 * - 날짜는 동적 상대시간이 아닌, createdAt에 들어있는 정적 문자열을 그대로 표시
 */
const PointHistoryScreen = () => {
  /** 뒤로가기 용 내비게이션 */
  const navigation = useNavigation<any>();

  /**
   * 적립(받은 내역)만 필터링
   * - xpDelta > 0 또는 ptDelta > 0 이면 "받은 내역"으로 취급
   * - 둘 다 0이거나 음수면(사용/차감) 리스트에서 제외
   */
  const earnedList = useMemo(() => {
    return pointHistoryMock.filter(it => it.xpDelta > 0 || it.ptDelta > 0);
  }, []);

  /**
   * FlatList 각 아이템 렌더링
   * - 배지는 값이 있을 때만 표시 (0이면 미표시)
   * - title: 내역 설명 문장
   * - createdAt: 정적 날짜 문자열 그대로 출력
   */
  const renderItem = ({ item }: { item: PointHistoryItem }) => {
    const hasXp = item.xpDelta > 0;
    const hasPt = item.ptDelta > 0;

    return (
      <View style={styles.row}>
        {/* 좌측 아이콘 자리(추후 실제 아이콘/캐릭터로 교체 가능) */}
        <View style={styles.icon} />

        {/* 우측 콘텐츠 영역 */}
        <View style={styles.content}>
          {/* 상단: XP/P 값 텍스트(배경 없는 컬러 텍스트) */}
          <View style={styles.badgeLine}>
            {hasXp && (
              <Text style={[styles.badgeText, styles.badgeXp]}>
                {item.xpDelta} XP
              </Text>
            )}

            {hasPt && (
              <Text style={[styles.badgeText, styles.badgePt]}>
                {item.ptDelta}P
              </Text>
            )}
          </View>

          {/* 중단: 내역 설명 */}
          <Text style={styles.message} numberOfLines={2}>
            {item.title}
          </Text>

          {/* 하단: 날짜(정적 문자열 그대로) */}
          <Text style={styles.date}>{item.createdAt}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>받은 내역 확인하기</Text>

        {/* 타이틀 중앙 정렬용 더미 */}
        <View style={{ width: 32 }} />
      </View>

      {/* 적립 내역 리스트 */}
      <FlatList
        data={earnedList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default PointHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* 헤더 */
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  back: { fontSize: 20 },
  headerTitle: { fontSize: 16, fontWeight: '700' },

  /* 리스트 */
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginVertical: 12,
  },

  /* 아이템 */
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginTop: 2,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },

  /* XP/P 배지 텍스트 라인 */
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '900',
  },
  badgeXp: {
    color: '#F59E0B',
  },
  badgePt: {
    color: '#3B82F6',
  },

  /* 설명 문장 */
  message: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },

  /* 날짜 */
  date: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#98A2B3',
  },
});
