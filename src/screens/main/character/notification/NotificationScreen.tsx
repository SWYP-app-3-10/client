import React, {useState} from 'react';
import {View, Text, Pressable, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  notificationMock,
  NotificationItem,
} from '../notification/notification_mockData';

/**
 * 알림 화면 (더미 데이터 기반)
 */
const NotificationScreen = () => {
  const navigation = useNavigation<any>();

  // 더미 데이터로 초기화 (백엔드 연동 전)
  const [list, setList] = useState<NotificationItem[]>(notificationMock);

  // 뒤로가기
  const onPressBack = () => {
    // 일반적으로는 goBack이 UX에 맞고,
    // 스택이 없을 때를 대비해 popToTop fallback
    if (navigation.canGoBack?.()) navigation.goBack();
    else navigation.popToTop?.();
  };

  /**
   * 알림 클릭 시 읽음 처리
   * - 해당 id의 isRead 값을 true로 변경
   */
  const onPressItem = (id: string) => {
    setList(prev => prev.map(n => (n.id === id ? {...n, isRead: true} : n)));
  };

  /**
   * FlatList의 각 아이템 렌더링
   * - 안 읽은 알림(!isRead)만 연보라 배경으로 하이라이트
   */
  const renderItem = ({item}: {item: NotificationItem}) => {
    const isUnread = !item.isRead;

    return (
      <Pressable
        onPress={() => onPressItem(item.id)}
        style={[styles.row, isUnread && styles.rowUnread]}>
        <Text style={[styles.title, isUnread && styles.titleUnread]}>
          {item.title}
        </Text>

        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.date}>{item.createdAt}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* ===== 헤더 ===== */}
      <View style={styles.header}>
        <Pressable
          onPress={onPressBack}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>알림</Text>
        <View style={styles.headerRightSpace} />
      </View>

      {/* ===== 알림 리스트 ===== */}
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              7일 전 알림까지 확인할 수 있어요
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ✅ 헤더 스타일 누락되어 있어서 추가
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 26,
    color: '#111',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  headerRightSpace: {
    width: 44,
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  row: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#fff',
  },
  rowUnread: {
    backgroundColor: '#F4F1FF',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  titleUnread: {
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#98A2B3',
  },

  date: {
    marginTop: 13,
    fontSize: 12,
    color: '#B3B8C4',
  },

  footer: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#B3B8C4',
  },
});
