import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {notificationMock, NotificationItem} from '../character_mockData';

/**
 * 알림 화면
 * - 읽음 / 안읽음 상태 표현
 */
const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const [list, setList] = useState<NotificationItem[]>(notificationMock);

  /**
   * 알림 클릭 시 읽음 처리
   */
  const onPressItem = (id: string) => {
    setList(prev => prev.map(n => (n.id === id ? {...n, isRead: true} : n)));
  };

  const renderItem = ({item}: {item: NotificationItem}) => {
    return (
      <Pressable
        style={[styles.row, !item.isRead && styles.rowUnread]}
        onPress={() => onPressItem(item.id)}>
        <Text style={[styles.title, !item.isRead && styles.titleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.date}>{item.createdAt}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>알림</Text>
        <View style={{width: 32}} />
      </View>

      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef2f7',
    backgroundColor: '#fff',
  },
  rowUnread: {
    backgroundColor: '#F8FAFF',
    borderColor: '#D6E4FF',
  },

  title: {fontSize: 14, fontWeight: '600', color: '#101828'},
  titleUnread: {fontWeight: '800'},

  date: {marginTop: 6, fontSize: 12, color: '#667085'},
});
