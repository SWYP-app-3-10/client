import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import SearchResultItem from './components/SearchResultItem';
import type { NewsItems } from '../../data/mock/searchData';
import { COLORS, scaleWidth } from '../../styles/global';

// ✅ SearchResultScreen이랑 동일하게 useExploreContents로 통일
import { useExploreContents } from '../../hooks/useExploreContents';

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
  const trimmed = keyword.trim();

  // ✅ "전체" 탐색 데이터를 받아오고, 프론트에서 keyword로 필터링
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isRefetching,
  } = useExploreContents(undefined);

  // ✅ explore 응답(pages -> contents)을 UI 데이터로 변환
  const allVisibleData: NewsItems[] = useMemo(() => {
    const pages = data?.pages ?? [];
    const allContents = pages.flatMap(p => p.contents ?? []);

    return allContents.map(c => ({
      id: String(c.contentId),
      category: (c.categoryName || '전체') as any,
      title: c.title || '',
      subtitle: '',
      readTime: `${c.readingTime ?? 0}분 소요`,
      imageUrl: c.imgUrl || '',
      content: '',
    }));
  }, [data]);

  // ✅ keyword로 필터링 (제목 기준) - SearchResultScreen과 동일
  const liveResults: NewsItems[] = useMemo(() => {
    const kw = trimmed.toLowerCase();
    if (!kw) return [];

    return allVisibleData.filter(item =>
      (item.title ?? '').toLowerCase().includes(kw),
    );
  }, [allVisibleData, trimmed]);

  /**
   * ✅ (나중에 백엔드 무한스크롤 붙었을 때) 결과가 없으면 자동으로 더 받아오기
   * - 지금은 백엔드가 nextBatchTime을 안 주니까 hasNextPage=false로 동작 안 함(안전)
   */
  const autoFetchGuard = useRef(false);

  useEffect(() => {
    autoFetchGuard.current = false;
  }, [trimmed]);

  useEffect(() => {
    if (!trimmed) return;
    if (isLoading || isRefetching || isFetchingNextPage) return;
    if (isError) return;

    if (liveResults.length === 0 && hasNextPage && !autoFetchGuard.current) {
      autoFetchGuard.current = true;
      fetchNextPage().finally(() => {
        autoFetchGuard.current = false;
      });
    }
  }, [
    trimmed,
    liveResults.length,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    isError,
  ]);

  // ✅ 검색어가 비어 있으면 오버레이 자체를 렌더링하지 않음
  if (!trimmed) return null;

  // ✅ 초기 로딩만 로더 보여주고(데이터가 이미 있으면 바로 결과 렌더)
  const showInitialLoading = isLoading && !data;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      {showInitialLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color={COLORS.puple.main}
        />
      ) : (
        <FlatList
          data={liveResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SearchResultItem item={item} onPress={() => onPressItem(item)} />
          )}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator
                style={{ margin: 20 }}
                color={COLORS.puple.main}
              />
            ) : (
              <View style={{ height: 20 }} />
            )
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {isError
                ? '데이터를 불러오지 못했습니다.'
                : hasNextPage
                ? '검색 결과를 찾는 중입니다...'
                : '검색 결과가 없습니다.'}
            </Text>
          }
        />
      )}
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
    marginTop: scaleWidth(20),
    textAlign: 'center',
  },
});
