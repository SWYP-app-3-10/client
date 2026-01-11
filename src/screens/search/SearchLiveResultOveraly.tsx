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

import { useExploreContents } from '../../hooks/useExploreContents';

type Props = {
  // 현재 입력 중인 검색어
  keyword: string;

  // 아이템 클릭 시(기사 이동/검색어 저장 등) 상위에서 처리
  onPressItem: (item: NewsItems) => void;
};

/**
 * SearchLiveResultOverlay
 * - SearchResultScreen과 동일하게 explore(전체)를 받아온 뒤, 프론트에서 keyword로 필터링
 * - SearchInputScreen 위를 absolute overlay로 덮어 "입력 중 결과"를 보여줌
 *
 * ✅참고
 * - 현재 백엔드 무한스크롤 미적용 상태: explore 전체가 1페이지(예: 10개)만 내려올 수 있음
 * - 이 경우 라이브 검색 결과도 첫 페이지 데이터 범위에서만 매칭됨
 * - 백엔드가 nextBatchTime 기반으로 페이지네이션을 붙이면 자동 fetch 로직이 동작하도록 구성됨
 */
export default function SearchLiveResultOverlay({
  keyword,
  onPressItem,
}: Props) {
  const trimmed = keyword.trim();

  // explore "전체" 데이터 조회
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isRefetching,
  } = useExploreContents(undefined);

  // explore 응답(pages -> contents)을 UI 모델로 변환
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

  // 입력값 기준(제목 포함)으로 필터링
  const liveResults: NewsItems[] = useMemo(() => {
    const kw = trimmed.toLowerCase();
    if (!kw) return [];

    return allVisibleData.filter(item =>
      (item.title ?? '').toLowerCase().includes(kw),
    );
  }, [allVisibleData, trimmed]);

  // 결과가 없고 다음 페이지가 있으면 추가 페이지를 가져오도록 준비
  // (현재 백엔드 미적용이면 hasNextPage=false라 동작하지 않음)
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

  // 검색어가 없으면 오버레이를 렌더링하지 않음
  if (!trimmed) return null;

  // 최초 로딩만 로더 노출(이미 캐시가 있으면 바로 리스트 표시)
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
  // SearchInputScreen 위를 덮는 오버레이 레이어
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
  },
  // 기존 리스트 여백/간격 유지
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
