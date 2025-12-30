import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import SearchResultItem from './components/SearchResultItem';
import { MOCK_NEWS, NewsItems } from '../../data/mock/searchData';
import { COLORS, scaleWidth } from '../../styles/global';

type Props = {
  // 현재 입력 중인 검색어
  keyword: string;

  // 검색 결과 아이템 클릭 시 실행할 핸들러
  // (SearchInputScreen에서 기사 이동 / 검색어 저장 등을 처리)
  onPressItem: (item: NewsItems) => void;
};

export default function SearchLiveResultOverlay({
  keyword,
  onPressItem,
}: Props) {
  // 입력 중인 keyword 기준으로 실시간 검색 결과 필터링
  // 기존 최근 검색어 UI를 건드리지 않기 위해 오버레이 컴포넌트로 분리
  const liveResults: NewsItems[] = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return [];

    return MOCK_NEWS.filter(item =>
      (item.title + item.subtitle + item.content).toLowerCase().includes(kw),
    );
  }, [keyword]);

  // 검색어가 비어 있으면 오버레이 자체를 렌더링하지 않음
  // (X 버튼으로 입력 삭제 시 자동으로 사라지게 하기 위함)
  if (!keyword.trim()) return null;

  return (
    // absoluteFillObject를 사용해
    // SearchInputScreen의 기존 UI 위를 "덮는" 오버레이 레이어
    <View style={styles.overlay} pointerEvents="auto">
      <FlatList
        data={liveResults}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SearchResultItem item={item} onPress={() => onPressItem(item)} />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
  },
  listContent: {
    paddingTop: scaleWidth(12),
    paddingBottom: scaleWidth(24),
    gap: scaleWidth(12),
  },
  emptyText: {
    fontSize: scaleWidth(13),
    color: COLORS.gray400,
    marginTop: scaleWidth(6),
    textAlign: 'center',
  },
});
