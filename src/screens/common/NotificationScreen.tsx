import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header'; // ✅ 공통 헤더 컴포넌트

import {
  notificationMock,
  NotificationItem,
} from '../../data/mock/notificationData';
import { COLORS, scaleWidth } from '../../styles/global';

/**
 * NotificationScreen
 *
 * - 알림 목록 화면 (더미 데이터 기반)
 * - 알림 클릭 시 해당 항목을 읽음 처리(isRead = true)
 * - 읽지 않은 알림은 배경색으로 강조 표시
 */
const NotificationScreen = () => {
  /** 뒤로가기용 내비게이션 */
  const navigation = useNavigation<any>();

  /** 알림 목록 상태 (추후 API 연동 시 서버 데이터로 교체) */
  const [list, setList] = useState<NotificationItem[]>(notificationMock);

  /**
   * 뒤로가기 처리
   * - 일반적으로는 goBack()
   * - 스택이 없을 수 있는 상황을 대비해 popToTop()을 fallback으로 사용
   */
  const onPressBack = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.popToTop?.();
    }
  };

  /**
   * 알림 클릭 시 읽음 처리
   * - 클릭된 알림의 id와 일치하는 항목만 isRead를 true로 변경
   */
  const onPressItem = (id: string) => {
    setList(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  /**
   * FlatList 아이템 렌더링
   * - 읽지 않은 알림(!isRead)만 배경색으로 하이라이트
   */
  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isUnread = !item.isRead;

    return (
      <Pressable
        onPress={() => onPressItem(item.id)}
        style={[styles.row, isUnread && styles.rowUnread]}
      >
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
      {/* 공통 헤더 */}
      <Header title="알림" goBackAction={onPressBack} />

      {/* 알림 리스트 */}
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
  // 전체 화면 컨테이너
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: scaleWidth(48),
  },

  /* 리스트 */

  // FlatList 전체 패딩 설정
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  /* 아이템 */

  // 알림 아이템 기본 행 스타일
  row: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: COLORS.white,
  },

  // 읽지 않은 알림 강조 배경
  rowUnread: {
    backgroundColor: COLORS.puple[3],
  },

  // 알림 제목 텍스트
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
  },

  // 읽지 않은 알림 제목 강조
  titleUnread: {
    fontWeight: '800',
  },

  // 알림 부제(설명) 텍스트
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.gray600,
  },

  // 알림 날짜 텍스트
  date: {
    marginTop: 13,
    fontSize: 12,
    color: COLORS.gray500,
  },

  /* 푸터 안내 문구 */

  // 리스트 하단 안내 영역
  footer: {
    paddingVertical: 22,
    alignItems: 'center',
  },

  // 푸터 안내 텍스트
  footerText: {
    fontSize: 12,
    color: COLORS.gray500,
  },
});
