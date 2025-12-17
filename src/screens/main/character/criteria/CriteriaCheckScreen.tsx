import React, {useState} from 'react';
import {SafeAreaView, View, Text, Pressable, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import LevelCriteriaScreen from './level/LevelCriteriaScreen';
import PointCriteriaScreen from './expAndPoint/PointCriteriaScreen';

type TabKey = 'LEVEL' | 'POINT';

const CriteriaCheckScreen = () => {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<TabKey>('LEVEL');

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>기준 확인하기</Text>
        <View style={{width: 24}} />
      </View>

      {/* 탭 버튼 */}
      <View style={styles.segmentWrap}>
        <Pressable
          onPress={() => setTab('LEVEL')}
          style={[
            styles.segmentBtn,
            tab === 'LEVEL' && styles.segmentBtnActive,
          ]}>
          <Text
            style={[
              styles.segmentText,
              tab === 'LEVEL' && styles.segmentTextActive,
            ]}>
            레벨
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTab('POINT')}
          style={[
            styles.segmentBtn,
            tab === 'POINT' && styles.segmentBtnActive,
          ]}>
          <Text
            style={[
              styles.segmentText,
              tab === 'POINT' && styles.segmentTextActive,
            ]}>
            경험치 / 포인트
          </Text>
        </Pressable>
      </View>

      {/* 내용 */}
      <View style={styles.body}>
        {tab === 'LEVEL' ? <LevelCriteriaScreen /> : <PointCriteriaScreen />}
      </View>
    </SafeAreaView>
  );
};

export default CriteriaCheckScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {width: 24},
  back: {fontSize: 20},
  headerTitle: {fontSize: 16, fontWeight: '700'},

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
  segmentBtnActive: {backgroundColor: '#fff'},
  segmentText: {fontSize: 13, color: '#9AA0A6', fontWeight: '700'},
  segmentTextActive: {color: '#111'},

  body: {flex: 1, paddingTop: 8},
});
