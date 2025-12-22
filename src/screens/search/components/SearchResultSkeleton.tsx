import React from 'react';
import { StyleSheet, View } from 'react-native';
import Shimmer from './Shimmer';

/**
 * SearchResultSkeleton
 *
 * - 뉴스 카드 로딩 스켈레톤 1개
 * - 실제 SearchResultItem 레이아웃과 유사한 형태
 */
export default function SearchResultSkeleton() {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Shimmer style={styles.line1} />
        <Shimmer style={styles.line2} />
        <Shimmer style={styles.line3} />
      </View>
      <Shimmer style={styles.thumb} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },
  left: { flex: 1 },
  line1: { height: 14, borderRadius: 6, width: '72%', marginBottom: 8 },
  line2: { height: 12, borderRadius: 6, width: '88%', marginBottom: 6 },
  line3: { height: 11, borderRadius: 6, width: '40%' },
  thumb: { width: 56, height: 56, borderRadius: 12, marginLeft: 12 },
});
