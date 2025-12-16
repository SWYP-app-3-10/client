import React, {useMemo} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {levelDetailMap} from '../character_mockData';

/**
 * 레벨 상세 기준 화면
 * - 레벨별 경험치 / 포인트 획득 정책 표시
 */
const LevelCriteriaDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 이전 화면에서 전달받은 levelId
  const levelId: number = route.params?.levelId ?? 1;

  /**
   * 현재 레벨의 상세 데이터
   * (없을 경우 1레벨 fallback)
   */
  const detail = useMemo(() => {
    return levelDetailMap[levelId] ?? levelDetailMap[1];
  }, [levelId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>기준 확인하기</Text>
        <View style={{width: 24}} />
      </View>

      {/* 레벨 정보 카드 */}
      <View style={styles.topCard}>
        <Text style={styles.levelTitle}>{detail.title}</Text>
        <Text style={styles.requiredExp}>
          기준 경험치 {detail.requiredExp} XP
        </Text>
      </View>

      {/* 경험치 / 포인트 정책 */}
      <Text style={styles.sectionTitle}>
        경험치와 포인트는 이렇게 모을 수 있어요!
      </Text>

      <View style={styles.box}>
        {detail.rewards.map(reward => (
          <View key={reward.label} style={styles.rewardRow}>
            <Text style={styles.rewardLabel}>{reward.label}</Text>

            <View style={styles.rewardRight}>
              <View style={[styles.pill, styles.pillXp]}>
                <Text style={styles.pillText}>+{reward.xp} XP</Text>
              </View>
              <View style={[styles.pill, styles.pillPt]}>
                <Text style={styles.pillText}>+{reward.pt} P</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 안내 문구 */}
      <Text style={styles.sectionTitle}>안내</Text>
      <View style={styles.box}>
        {detail.tips.map((tip, idx) => (
          <Text key={idx} style={styles.tip}>
            • {tip}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default LevelCriteriaDetailScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingHorizontal: 16},

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {fontSize: 20},
  headerTitle: {fontSize: 16, fontWeight: '700'},

  topCard: {
    marginTop: 8,
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  levelTitle: {fontSize: 16, fontWeight: '900'},
  requiredExp: {marginTop: 6, fontSize: 12, color: '#667085'},

  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '800',
  },

  box: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },

  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f7',
  },
  rewardLabel: {flex: 1, fontSize: 13, fontWeight: '700'},
  rewardRight: {flexDirection: 'row', gap: 8},

  pill: {paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999},
  pillXp: {backgroundColor: '#E0F2FE'},
  pillPt: {backgroundColor: '#FEF3C7'},
  pillText: {fontSize: 11, fontWeight: '800'},

  tip: {fontSize: 12, color: '#667085', marginBottom: 6},
});
