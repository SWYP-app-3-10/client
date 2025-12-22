import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NewsCategory } from '../search_mockData';

type Props = {
  /** 전체 카테고리 목록 */
  categories: NewsCategory[];

  /** 현재 선택된 카테고리 */
  selected: NewsCategory;

  /** 카테고리 선택 시 호출되는 콜백 */
  onSelect: (cat: NewsCategory) => void;
};

/**
 * CategoryTabs
 *
 * - 뉴스 카테고리를 가로 스크롤 탭 형태로 표시
 * - 선택된 카테고리는 강조 스타일 적용
 * - 탭 클릭 시 상위 컴포넌트로 선택 이벤트 전달
 */
export default function CategoryTabs({
  categories,
  selected,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map(cat => {
        // 현재 카테고리가 선택 상태인지 여부
        const active = cat === selected;

        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.chip, active && styles.activeChip]}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/** 카테고리 칩 높이 상수 */
const CHIP_H = 28;

const styles = StyleSheet.create({
  /** 가로 스크롤 영역 패딩 */
  row: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 0,
  },

  /** 기본 카테고리 칩 스타일 */
  chip: {
    height: CHIP_H,
    borderRadius: CHIP_H / 2,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#F4EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** 선택된 카테고리 칩 스타일 */
  activeChip: {
    backgroundColor: '#6D4CFF',
  },

  /** 기본 카테고리 텍스트 */
  text: {
    fontSize: 13,
    color: '#6D4CFF',
  },

  /** 선택된 카테고리 텍스트 */
  activeText: {
    color: 'white',
    fontWeight: '600',
  },
});
