import React, {useMemo} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {levelList, LevelCriteria} from './levelData';

/**
 * LevelCriteriaScreen
 *
 * - 현재 경험치/레벨 정보를 보여주고, 레벨별 기준 목록을 렌더링하는 화면
 * - 상단: 현재 XP 및 다음 레벨까지 필요한 XP 안내 카드
 * - 하단: 전체 레벨 리스트(현재 레벨에는 "내 레벨" 배지 표시)
 */
const LevelCriteriaScreen = () => {
  /**
   * 현재 유저 상태 (더미 데이터)
   * - 추후 서버 응답 또는 전역 상태(예: Redux/Zustand/React Query)로 교체
   */
  const currentXp = 50;
  const currentLevelId = 1;

  /**
   * 다음 레벨 달성까지 필요한 XP 계산
   * - 현재 레벨 + 1의 requiredExp를 찾아서 (requiredExp - currentXp) 계산
   * - 데이터가 없거나 음수면 0으로 처리
   */
  const xpToNext = useMemo(() => {
    const next = levelList.find(l => l.id === currentLevelId + 1);
    if (!next) return 0;
    return Math.max(0, next.requiredExp - currentXp);
  }, [currentLevelId, currentXp]);

  /**
   * 레벨 리스트 렌더러
   * - 현재 레벨 항목이면 "내 레벨" 배지를 추가로 노출
   */
  const renderItem = ({item}: {item: LevelCriteria}) => {
    const isMine = item.id === currentLevelId;

    return (
      <View style={styles.row}>
        {/* 레벨 대표 이미지 영역(썸네일 자리) */}
        <View style={styles.thumb} />

        {/* 텍스트 영역 */}
        <View style={{flex: 1}}>
          <View style={styles.rowTop}>
            {/* 레벨명 */}
            <Text style={styles.title}>{item.title}</Text>

            {/* 현재 레벨일 때만 표시되는 배지 */}
            {isMine && (
              <View style={styles.myLevelPill}>
                <Text style={styles.myLevelText}>내 레벨</Text>
              </View>
            )}
          </View>

          {/* 요약 타이틀/설명 */}
          <Text style={styles.summaryTitle}>{item.summaryTitle}</Text>
          <Text style={styles.summaryDesc}>{item.summaryDesc}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 상단: 현재 XP 요약 카드 */}
      <View style={styles.xpCard}>
        <View style={{flex: 1}}>
          <Text style={styles.xpQ}>현재 나의 경험치는?</Text>
          <Text style={styles.xpValue}>{currentXp} XP</Text>

          <Text style={styles.xpHint}>
            다음 단계 달성을 위해서는{'\n'}
            <Text style={styles.xpHintStrong}>{xpToNext}XP</Text>가 더 필요해요
          </Text>
        </View>

        {/* 카드 우측 이미지 영역(추후 캐릭터/아이콘 삽입 가능) */}
        <View style={styles.xpImg} />
      </View>

      {/* 하단: 레벨 기준 리스트 */}
      <FlatList
        data={levelList}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
      />
    </View>
  );
};

export default LevelCriteriaScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  xpCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
  },
  xpQ: {fontSize: 12, fontWeight: '700', color: '#111'},
  xpValue: {marginTop: 6, fontSize: 22, fontWeight: '900', color: '#111'},
  xpHint: {marginTop: 8, fontSize: 12, color: '#98A2B3', lineHeight: 16},
  xpHintStrong: {color: '#7C3AED', fontWeight: '900'},
  xpImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },

  row: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },

  rowTop: {flexDirection: 'row', alignItems: 'center', gap: 8},
  title: {fontSize: 14, fontWeight: '900', color: '#111827'},

  myLevelPill: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLevelText: {fontSize: 11, fontWeight: '900', color: '#7C3AED'},

  summaryTitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#667085',
  },
  summaryDesc: {marginTop: 2, fontSize: 12, color: '#98A2B3'},
});
