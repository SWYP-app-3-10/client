import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

/**
 * 경험치/포인트 획득 기준 목록
 * - label: 조건 설명
 * - xp: 지급 경험치(표시용 문자열)
 * - p: 지급 포인트(표시용 문자열)
 */
const rows = [
  { label: '미션 달성 시', xp: '40 XP', p: '40 P' },
  { label: '글 읽었을 시', xp: '5 xp', p: '' },
  { label: '퀴즈 정답 시', xp: '20 XP', p: '30 P' },
  { label: '퀴즈 오답 시', xp: '10 XP', p: '10 P' },
  { label: '데일리 출석 시', xp: '5 XP', p: '10 P' },
  { label: '위클리 출석 시', xp: '30 XP', p: '30 P' },
  { label: '광고 보았을 시', xp: '', p: '60 P' },
];

/**
 * PointCriteriaScreen
 *
 * - 포인트/경험치 개념 설명 + 획득 기준 안내 화면
 * - 상단: 포인트/경험치 정의 카드
 * - 하단: 조건별 보상 리스트(배지 형태)
 */
const PointCriteriaScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* 섹션 1: 개념 설명 */}
      <Text style={styles.h1}>포인트 & 경험치란?</Text>

      <View style={styles.card}>
        {/* 포인트 설명 */}
        <View style={styles.cardRow}>
          <View style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, styles.pointTitle]}>포인트</Text>
            <Text style={styles.cardDesc}>
              포인트를 사용해 글을 더 읽을 수 있어요{'\n'}글 하나에 60 포인트가
              필요해요
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 경험치 설명 */}
        <View style={styles.cardRow}>
          <View style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, styles.xpTitle]}>경험치</Text>
            <Text style={styles.cardDesc}>
              경험치를 통해 레벨 업을 할 수 있어요
            </Text>
          </View>
        </View>
      </View>

      {/* 섹션 2: 획득 기준 목록 */}
      <Text style={[styles.h1, { marginTop: 18 }]}>
        경험치와 포인트는 이렇게 모을 수 있어요!
      </Text>

      <View style={styles.list}>
        {rows.map(r => (
          <View key={r.label} style={styles.row}>
            {/* 조건 라벨 */}
            <Text style={styles.rowLabel}>{r.label}</Text>

            {/* 보상 배지 (값이 있는 경우에만 노출) */}
            <View style={styles.badges}>
              {!!r.xp && (
                <View style={[styles.badge, styles.badgeXp]}>
                  <Text style={styles.badgeText}>{r.xp}</Text>
                </View>
              )}
              {!!r.p && (
                <View style={[styles.badge, styles.badgePt]}>
                  <Text style={styles.badgeText}>{r.p}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default PointCriteriaScreen;

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 24 },

  h1: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 10 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    padding: 14,
    backgroundColor: '#fff',
  },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  icon: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#E5E7EB' },

  cardTitle: { fontSize: 13, fontWeight: '900', marginBottom: 6 },
  pointTitle: { color: '#F59E0B' },
  xpTitle: { color: '#3B82F6' },
  cardDesc: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#EFF1F4', marginVertical: 12 },

  list: { marginTop: 8, gap: 10 },
  row: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { fontSize: 13, fontWeight: '800', color: '#111' },

  badges: { flexDirection: 'row', gap: 8 },
  badge: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeXp: { backgroundColor: '#E0F2FE' },
  badgePt: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 12, fontWeight: '900', color: '#111' },
});
