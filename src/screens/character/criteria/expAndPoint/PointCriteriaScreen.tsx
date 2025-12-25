// PointCriteriaScreen.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

// 공통 디자인 시스템 (색/스케일/라운드/타이포)
import {
  COLORS,
  BORDER_RADIUS,
  scaleWidth,
  Body_16SB,
  Caption_12M,
  Heading_24EB_Round,
} from '../../../../styles/global';

/**
 * 경험치/포인트 획득 기준 목록
 * - label: 조건 설명
 * - xp: 지급 경험치(표시용 문자열)
 * - p: 지급 포인트(표시용 문자열)
 */
const rows = [
  { label: '미션 달성 시', xp: '40 XP', p: '40 P' },
  { label: '글 읽었을 시', xp: '5 XP', p: '' },
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
    <ScrollView
      contentContainerStyle={styles.wrap}
      showsVerticalScrollIndicator={false}
    >
      {/* 섹션 1: 개념 설명 */}
      <Text style={styles.h1}>포인트 & 경험치란?</Text>

      <View style={styles.card}>
        {/* 경험치 설명 */}
        <View style={styles.cardRow}>
          <View style={styles.icon} />
          <View style={styles.cardTextArea}>
            <Text style={[styles.cardTitle, styles.xpTitle]}>경험치</Text>
            <Text style={styles.cardDesc}>
              경험치를 통해 레벨 업을 할 수 있어요
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 포인트 설명 */}
        <View style={styles.cardRow}>
          <View style={styles.icon} />
          <View style={styles.cardTextArea}>
            <Text style={[styles.cardTitle, styles.pointTitle]}>포인트</Text>
            <Text style={styles.cardDesc}>
              포인트를 사용해 글을 더 읽을 수 있어요{'\n'}글 하나에 30 포인트가
              필요해요
            </Text>
          </View>
        </View>
      </View>

      {/* 섹션 2: 획득 기준 목록 */}
      <Text style={styles.h2}>경험치와 포인트는 이렇게 모을 수 있어요!</Text>

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
  wrap: {
    paddingBottom: scaleWidth(24), // 하단 스크롤 여백(부모 paddingHorizontal 사용 중)
  },

  h1: {
    ...Heading_24EB_Round, // 섹션 타이틀 타이포
    color: COLORS.black, // 타이틀 색상
    marginBottom: scaleWidth(10), // 타이틀 아래 간격
  },

  h2: {
    ...Body_16SB, // 섹션 타이틀(하단) 타이포
    color: COLORS.black, // 타이틀 색상
    marginTop: scaleWidth(18), // 위쪽 간격
    marginBottom: scaleWidth(10), // 아래 간격
  },

  card: {
    borderRadius: BORDER_RADIUS[16], // 카드 라운드
    borderWidth: scaleWidth(1), // 카드 테두리 두께
    borderColor: COLORS.gray200, // 카드 테두리 색상
    padding: scaleWidth(14), // 카드 내부 패딩
    backgroundColor: COLORS.white, // 카드 배경색
  },

  cardRow: {
    flexDirection: 'row', // 아이콘 + 텍스트 가로 배치
    alignItems: 'flex-start', // 상단 기준 정렬
    gap: scaleWidth(12), // 아이콘/텍스트 간격
  },

  cardTextArea: {
    flex: 1, // 텍스트 영역이 남는 공간 채움
  },

  icon: {
    width: scaleWidth(22), // 아이콘 너비
    height: scaleWidth(22), // 아이콘 높이
    borderRadius: BORDER_RADIUS[10] ?? scaleWidth(6), // 아이콘 라운드(토큰 없으면 스케일)
    backgroundColor: COLORS.gray200, // 아이콘 임시 배경색
  },

  cardTitle: {
    ...Body_16SB, // 타이틀 타이포
    marginBottom: scaleWidth(6), // 타이틀-설명 간격
  },

  pointTitle: {
    color: COLORS.puple.main, // 포인트 타이틀 컬러(메인 컬러로 통일)
  },

  xpTitle: {
    color: COLORS.puple.main, // 경험치 타이틀 컬러(메인 컬러로 통일)
  },

  cardDesc: {
    ...Caption_12M, // 설명 타이포
    color: COLORS.gray700, // 설명 텍스트 색상
    lineHeight: scaleWidth(18), // 줄간격
  },

  divider: {
    height: scaleWidth(1), // 구분선 두께
    backgroundColor: COLORS.gray100, // 구분선 색상
    marginVertical: scaleWidth(24), // 위아래 간격
  },

  list: {
    marginTop: scaleWidth(8), // 타이틀과 리스트 간격
    gap: scaleWidth(16), // 행 간 간격
  },

  row: {
    height: scaleWidth(72), // 행 높이
    borderRadius: BORDER_RADIUS[16], // 행 라운드
    borderWidth: scaleWidth(1), // 행 테두리 두께
    borderColor: COLORS.gray200, // 행 테두리 색상
    backgroundColor: COLORS.white, // 행 배경색
    padding: scaleWidth(20), // 좌우 패딩
    flexDirection: 'row', // 라벨 + 배지 가로 배치
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'space-between', // 양 끝 정렬
  },

  rowLabel: {
    ...Body_16SB, // 라벨 타이포
    color: COLORS.black, // 라벨 색상
  },

  badges: {
    flexDirection: 'row', // 배지 가로 배치
    gap: scaleWidth(6), // 배지 간 간격
  },

  badge: {
    paddingHorizontal: scaleWidth(8), // 배지 좌우 패딩
    height: scaleWidth(28), // 배지 높이
    borderRadius: scaleWidth(999), // pill 형태
    justifyContent: 'center', // 텍스트 세로 중앙
    alignItems: 'center', // 텍스트 가로 중앙
  },

  badgeXp: {
    backgroundColor: COLORS.puple[3], // XP 배지 배경(연한 메인)
  },

  badgePt: {
    backgroundColor: COLORS.gray100, // 포인트 배지 배경(연한 그레이)
  },

  badgeText: {
    ...Caption_12M, // 배지 텍스트 타이포
    color: COLORS.black, // 배지 텍스트 색상
  },
});
