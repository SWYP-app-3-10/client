import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {pointHistoryMock, PointHistoryItem} from '../character_mockData';

/**
 * 포인트 / 경험치 획득·사용 내역 화면
 */
const PointHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({item}: {item: PointHistoryItem}) => {
    return (
      <View style={styles.row}>
        {/* 아이콘 자리 */}
        <View style={styles.icon} />

        <View style={styles.center}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.createdAt}</Text>
        </View>

        {/* XP / 포인트 변화 */}
        <View style={styles.right}>
          <View style={[styles.badge, styles.badgeXp]}>
            <Text style={styles.badgeText}>
              {item.xpDelta >= 0 ? '+' : ''}
              {item.xpDelta} XP
            </Text>
          </View>

          <View style={[styles.badge, styles.badgePt]}>
            <Text style={styles.badgeText}>
              {item.ptDelta >= 0 ? '+' : ''}
              {item.ptDelta} P
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>받은 내역 확인하기</Text>
        <View style={{width: 32}} />
      </View>

      <FlatList
        data={pointHistoryMock}
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
  container: {flex: 1, backgroundColor: '#fff'},

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {width: 32, height: 32, justifyContent: 'center'},
  back: {fontSize: 20},
  headerTitle: {fontSize: 16, fontWeight: '700'},

  listContent: {paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8},
  separator: {height: 12},

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef2f7',
    backgroundColor: '#fff',
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f2f4f7',
    marginRight: 12,
  },

  center: {flex: 1},
  title: {fontSize: 14, fontWeight: '700', color: '#101828'},
  date: {marginTop: 6, fontSize: 12, color: '#667085'},

  right: {alignItems: 'flex-end', gap: 6},

  badge: {paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999},
  badgeXp: {backgroundColor: '#E0F2FE'},
  badgePt: {backgroundColor: '#FEF3C7'},
  badgeText: {fontSize: 11, fontWeight: '800', color: '#111827'},
});
