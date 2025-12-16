import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../../../../../routes';
import {levelList, LevelCriteria} from '../character_mockData';

/**
 * 레벨 기준 목록 화면
 * - 현재 레벨별 기준을 리스트로 보여줌
 * - 각 항목 클릭 시 LevelCriteriaDetailScreen으로 이동
 */
const LevelCriteriaScreen = () => {
  const navigation = useNavigation<any>();

  /**
   * FlatList 각 아이템 렌더링
   */
  const renderItem = ({item}: {item: LevelCriteria}) => {
    return (
      <Pressable
        style={styles.row}
        onPress={() =>
          // 선택한 레벨 id를 상세 화면으로 전달
          navigation.navigate(RouteNames.CHARACTER_LEVEL_DETAIL, {
            levelId: item.id,
          })
        }>
        {/* 캐릭터 썸네일 자리 (추후 이미지로 교체 가능) */}
        <View style={styles.thumb} />

        {/* 레벨 정보 영역 */}
        <View style={{flex: 1}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
          <Text style={styles.exp}>기준 경험치 {item.requiredExp} XP</Text>
        </View>

        {/* 우측 화살표 */}
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>기준 확인하기</Text>

        {/* 중앙 정렬용 더미 */}
        <View style={{width: 24}} />
      </View>

      {/* 레벨 목록 */}
      <FlatList
        data={levelList}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
      />
    </SafeAreaView>
  );
};

export default LevelCriteriaScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {fontSize: 20},
  headerTitle: {fontSize: 16, fontWeight: '700'},

  row: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef2f7',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  title: {fontSize: 14, fontWeight: '800', color: '#111827'},
  summary: {marginTop: 2, fontSize: 12, color: '#667085'},
  exp: {marginTop: 6, fontSize: 12, color: '#98A2B3'},
  chevron: {fontSize: 24, color: '#98A2B3'},
});
