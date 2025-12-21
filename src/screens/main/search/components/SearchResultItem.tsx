import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {NewsItems} from '../search_mockData';

type Props = {
  item: NewsItems;
  onPress?: () => void;
};

/**
 * ✅ 뉴스 카드 UI
 */
export default function SearchResultItem({item, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sub} numberOfLines={2}>
          {item.subtitle}
        </Text>
        <Text style={styles.meta}>{item.readTime}</Text>
      </View>

      <View style={styles.thumb} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },
  left: {flex: 1},
  title: {fontSize: 14, fontWeight: '600', marginBottom: 3},
  sub: {fontSize: 12, color: '#777', marginBottom: 6},
  meta: {fontSize: 11, color: '#6D4CFF'},
  thumb: {
    width: 56,
    height: 56,
    backgroundColor: '#E7E7E7',
    borderRadius: 12,
    marginLeft: 12,
  },
});
