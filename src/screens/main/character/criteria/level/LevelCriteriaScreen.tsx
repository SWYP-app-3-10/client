import React, {useMemo} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {levelList, LevelCriteria} from './levelData';

const LevelCriteriaScreen = () => {
  // ✅ 더미: 추후 서버/전역 상태로 교체
  const currentXp = 50;
  const currentLevelId = 1;

  const xpToNext = useMemo(() => {
    const next = levelList.find(l => l.id === currentLevelId + 1);
    if (!next) return 0;
    return Math.max(0, next.requiredExp - currentXp);
  }, [currentLevelId, currentXp]);

  const renderItem = ({item}: {item: LevelCriteria}) => {
    const isMine = item.id === currentLevelId;

    return (
      <View style={styles.row}>
        <View style={styles.thumb} />

        <View style={{flex: 1}}>
          <View style={styles.rowTop}>
            <Text style={styles.title}>{item.title}</Text>
            {isMine && (
              <View style={styles.myLevelPill}>
                <Text style={styles.myLevelText}>내 레벨</Text>
              </View>
            )}
          </View>

          <Text style={styles.summaryTitle}>{item.summaryTitle}</Text>
          <Text style={styles.summaryDesc}>{item.summaryDesc}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 상단 XP 카드 */}
      <View style={styles.xpCard}>
        <View style={{flex: 1}}>
          <Text style={styles.xpQ}>현재 나의 경험치는?</Text>
          <Text style={styles.xpValue}>{currentXp} XP</Text>
          <Text style={styles.xpHint}>
            다음 단계 달성을 위해서는{'\n'}
            <Text style={styles.xpHintStrong}>{xpToNext}XP</Text>가 더 필요해요
          </Text>
        </View>
        <View style={styles.xpImg} />
      </View>

      {/* 레벨 리스트 */}
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
