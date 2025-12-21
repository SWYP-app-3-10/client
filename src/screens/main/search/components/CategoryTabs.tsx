import React from 'react';
import {ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import type {NewsCategory} from '../search_mockData';

type Props = {
  categories: NewsCategory[];
  selected: NewsCategory;
  onSelect: (cat: NewsCategory) => void;
};

/**
 * ✅ 카테고리 가로 탭
 */
export default function CategoryTabs({categories, selected, onSelect}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {categories.map(cat => {
        const active = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.chip, active && styles.activeChip]}>
            <Text style={[styles.text, active && styles.activeText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const CHIP_H = 28;

const styles = StyleSheet.create({
  row: {paddingHorizontal: 16, paddingTop: 2, paddingBottom: 0},
  chip: {
    height: CHIP_H,
    borderRadius: CHIP_H / 2,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#F4EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChip: {backgroundColor: '#6D4CFF'},
  text: {fontSize: 13, color: '#6D4CFF'},
  activeText: {color: 'white', fontWeight: '600'},
});
