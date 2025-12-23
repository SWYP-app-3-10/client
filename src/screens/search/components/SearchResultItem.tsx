import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NewsItems } from '../../../data/mock/searchData';

type Props = {
  /** 표시할 뉴스 데이터 */
  item: NewsItems;

  /** 카드 클릭 시 호출되는 이벤트 (선택 사항) */
  onPress?: () => void;
};

/**
 * SearchResultItem
 *
 * - 검색 결과로 노출되는 단일 뉴스 카드 컴포넌트
 * - 제목 / 부제목 / 읽기 시간 정보 표시
 * - 카드 전체를 터치 영역으로 사용
 */
export default function SearchResultItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* 좌측 텍스트 영역 */}
      <View style={styles.left}>
        {/* 뉴스 제목 (1줄 제한) */}
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        {/* 뉴스 부제목 (2줄 제한) */}
        <Text style={styles.sub} numberOfLines={2}>
          {item.subtitle}
        </Text>

        {/* 읽기 시간 / 메타 정보 */}
        <Text style={styles.meta}>{item.readTime}</Text>
      </View>

      {/* 우측 썸네일 영역 (이미지 자리) */}
      <View style={styles.thumb} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /** 카드 전체 컨테이너 */
  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },

  /** 텍스트 영역 */
  left: {
    flex: 1,
  },

  /** 뉴스 제목 */
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },

  /** 뉴스 부제목 */
  sub: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },

  /** 읽기 시간 등 메타 정보 */
  meta: {
    fontSize: 11,
    color: '#6D4CFF',
  },

  /** 썸네일 영역 (이미지 적용 예정) */
  thumb: {
    width: 56,
    height: 56,
    backgroundColor: '#E7E7E7',
    borderRadius: 12,
    marginLeft: 12,
  },
});
