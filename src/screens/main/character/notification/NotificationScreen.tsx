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
        {/* 제목 */}
        <Text style={[styles.title, isUnread && styles.titleUnread]}>
          {item.title}
        </Text>

        {/* 서브타이틀(추천 문구) */}
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        {/* 날짜*/}
        <Text style={styles.date}>{item.createdAt}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== 헤더 ===== */}
      <View style={styles.header}>
        {/* 상단 뒤로가기 버튼*/}
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        {/* 타이틀 */}
        <Text style={styles.headerTitle}>알림</Text>

        {/* 오른쪽 여백*/}
        <View style={{width: 44}} />
      </View>

      {/* ===== 알림 리스트(RecyclerView 역할) ===== */}
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        // 풀 폭 디자인
        contentContainerStyle={styles.listContent}
        // 하단 안내 문구
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
  /**
   * 전체 화면 배경
   */
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /**
   * 헤더 영역
   */
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  /**
   * 뒤로가기 버튼
   * - 터치 영역 44x44 (모바일 권장 사이즈)
   * - 아이콘 크기 26
   */
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

  /**
   * 헤더 타이틀
   */
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  /**
   * 리스트 컨테이너
   */
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  /**
   * 풀 폭 row
   */
  row: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#fff',
  },

  /**
   * 안 읽은 알림 하이라이트(연보라)
   */
  rowUnread: {
    backgroundColor: '#F4F1FF',
  },

  /**
   * 텍스트 스타일
   */
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

  /**
   * 날짜
   */
  date: {
    marginTop: 13,
    fontSize: 12,
    color: '#B3B8C4',
  },

  /**
   * 하단 안내 문구
   */
  footer: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#B3B8C4',
  },
});
