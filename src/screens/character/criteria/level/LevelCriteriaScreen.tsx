// LevelCriteriaScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { levelList, LevelCriteria } from './levelData';

// 공통 디자인 시스템 (색/스케일/라운드/타이포)
import {
  COLORS,
  BORDER_RADIUS,
  scaleWidth,
  Body_16SB,
  Caption_12M,
  Heading_24EB_Round,
  Caption_14R,
  Heading_18EB_Round,
  Caption_12SB,
  Body_16M,
} from '../../../../styles/global';

/**
 * LevelCriteriaScreen
 *
 * - 현재 경험치/레벨 정보를 보여주고, 레벨별 기준 목록을 렌더링하는 화면
 * - 상단: 현재 XP 및 다음 레벨까지 필요한 XP 안내 카드
 *    ■ TODO "N" <-> "XP" 분리 필요
 * - 하단: 전체 레벨 리스트(현재 레벨에는 "내 레벨" 배지 표시)
 */
const LevelCriteriaScreen = () => {
  /**
   * 현재 유저 상태 (더미 데이터)
   * - 추후 서버 응답/전역 상태로 교체
   */
  const currentXp = 50;
  const currentLevelId = 1;

  /**
   * 다음 레벨 달성까지 필요한 XP 계산
   */
  const xpToNext = useMemo(() => {
    const next = levelList.find(l => l.id === currentLevelId + 1);
    if (!next) return 0;
    return Math.max(0, next.requiredExp - currentXp);
  }, [currentLevelId, currentXp]);

  /**
   * 레벨 리스트 아이템 렌더러
   */
  const renderItem = ({ item }: { item: LevelCriteria }) => {
    const isMine = item.id === currentLevelId;

    return (
      <View style={styles.row}>
        {/* 썸네일(대표 이미지) 자리 */}
        <View style={styles.thumb} />

        {/* 텍스트 영역 */}
        <View style={styles.textArea}>
          <View style={styles.rowTop}>
            {/* 레벨명 */}
            <Text style={styles.title}>{item.title}</Text>

            {/* 현재 레벨 배지 */}
            {isMine && (
              <View style={styles.myLevelPill}>
                <Text style={styles.myLevelText}>내 레벨</Text>
              </View>
            )}
          </View>

          {/* 요약 타이틀/설명 */}
          <Text style={styles.summaryTitle}>{item.summaryTitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={levelList} // 레벨 데이터
      keyExtractor={item => String(item.id)} // 고유키(문자열)
      renderItem={renderItem} // 아이템 렌더 함수
      showsVerticalScrollIndicator={false} // 스크롤바 숨김
      contentContainerStyle={styles.listContent} // 리스트 패딩/여백
      ItemSeparatorComponent={() => <View style={styles.separator} />} // 카드 간 간격
      ListHeaderComponent={
        <>
          {/* 상단: 현재 XP 요약 카드 */}
          <View style={styles.xpCard}>
            <View style={styles.xpLeft}>
              <Text style={styles.xpQ}>현재 나의 경험치는?</Text>

              <Text style={styles.xpValue}>{currentXp} XP</Text>

              <Text style={styles.xpHint}>
                다음 단계 달성을 위해서는{'\n'}
                <Text style={styles.xpHintStrong}>{xpToNext}XP</Text>가 더
                필요해요
              </Text>
            </View>

            {/* 우측 이미지/아이콘 자리 */}
            <View style={styles.xpImg} />
          </View>

          {/* XP 카드와 리스트 사이 간격 */}
          <View style={styles.headerSpace} />
        </>
      }
    />
  );
};

export default LevelCriteriaScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingTop: scaleWidth(32), // 상단 패딩
    paddingBottom: scaleWidth(32), // 하단 스크롤 여백
  },

  headerSpace: {
    height: scaleWidth(32), // 카드와 리스트 간격
  },

  separator: {
    height: scaleWidth(20), // 카드 간 간격
  },

  xpCard: {
    padding: scaleWidth(20), // 카드 내부 패딩
    borderRadius: BORDER_RADIUS[16], // 카드 라운드
    borderWidth: scaleWidth(1), // 카드 테두리 두께
    borderColor: COLORS.gray300, // 테두리 색
    backgroundColor: COLORS.white, // 카드 배경색
    flexDirection: 'row', // 좌(텍스트) 우(아이콘) 가로 배치
    alignItems: 'center', // 세로 중앙 정렬
  },

  xpLeft: {
    flex: 1, // 좌측 텍스트 영역이 남는 공간 채움
  },

  xpQ: {
    ...Body_16SB, // "현재 나의 경험치는?" 타이포
    color: COLORS.black, // 텍스트 색
  },

  xpValue: {
    ...Heading_24EB_Round, // N XP 타이포
    marginTop: scaleWidth(16), // 질문과 값 사이 간격
    color: COLORS.black, // 값 텍스트 색
  },

  xpHint: {
    ...Caption_14R, // 공통 타이포(캡션)
    marginTop: scaleWidth(8), // 값과 힌트 사이 간격
    color: COLORS.gray700, // 힌트 텍스트 색
  },

  xpHintStrong: {
    color: COLORS.puple.main, // 강조 텍스트 색
  },

  xpImg: {
    width: scaleWidth(92), // 아이콘 영역 너비
    height: scaleWidth(92), // 아이콘 영역 높이
    borderRadius: BORDER_RADIUS[12], // 아이콘 영역 라운드
    backgroundColor: COLORS.gray200, // 임시 배경
  },

  row: {
    backgroundColor: COLORS.white, // 카드 배경색
    flexDirection: 'row', // 썸네일 + 텍스트 가로 배치
    alignItems: 'center', // 세로 중앙 정렬
  },

  thumb: {
    width: scaleWidth(110), // 썸네일 너비
    height: scaleWidth(130), // 썸네일 높이
    borderRadius: BORDER_RADIUS[16], // 썸네일 라운드
    backgroundColor: COLORS.gray200, // TODO 임시 배경
    marginRight: scaleWidth(24), // 썸네일과 텍스트 사이 간격
  },

  textArea: {
    flex: 1, // 텍스트 영역이 남는 공간 채움
    gap: scaleWidth(3), // 텍스트 요소 간격
  },

  rowTop: {
    flexDirection: 'row', // 타이틀과 배지를 가로로
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'space-between', // 좌(타이틀) / 우(배지) 양끝 정렬
  },

  title: {
    ...Heading_18EB_Round, // 공통 타이포(본문 세미볼드)
    color: COLORS.black, // 타이틀 텍스트 색
    flex: 1, // 타이틀이 가능한 영역을 차지하게 해서 배지가 오른쪽으로 밀리게 함
    marginRight: scaleWidth(8), // 타이틀과 배지 사이 최소 간격(겹침 방지)
  },

  myLevelPill: {
    paddingVertical: scaleWidth(4), // 배지 상하 패딩
    paddingHorizontal: scaleWidth(8), // 배지 좌우 패딩
    borderRadius: BORDER_RADIUS[30], // pill 형태
    backgroundColor: COLORS.puple[3], // 배지 배경색
    justifyContent: 'center', // 텍스트 세로 중앙
    alignItems: 'center', // 텍스트 가로 중앙
  },

  myLevelText: {
    ...Caption_12SB, // 공통 타이포(캡션)
    color: COLORS.puple.main, // 배지 텍스트 색
  },

  summaryTitle: {
    ...Body_16M, // 공통 타이포(캡션)
    color: COLORS.gray800, // 요약 타이틀 색
  },

  summaryDesc: {
    ...Caption_12M, // 공통 타이포(캡션)
    marginTop: scaleWidth(2), // summaryTitle과 간격
    color: COLORS.gray700, // 설명 텍스트 색
  },
});
