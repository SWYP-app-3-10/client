import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RouteNames } from '../../../routes';
import type { FullScreenStackParamList } from '../../navigation/types';

import SearchHeader from './components/SearchHeader';
import SearchResultItem from './components/SearchResultItem';

import type { NewsItems } from '../../data/mock/searchData';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';

// ✅ 이걸로 통일
import { useExploreContents } from '../../hooks/useExploreContents';

import { COLORS, scaleWidth } from '../../styles/global';

export default function SearchResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FullScreenStackParamList>>();
  const route =
    useRoute<
      RouteProp<FullScreenStackParamList, typeof RouteNames.SEARCH_RESULT>
    >();
  const { keyword } = route.params;

  // ✅ "전체" 탐색 데이터를 받아오고, 프론트에서 검색 필터링
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isRefetching,
  } = useExploreContents(undefined);

  // 기사 클릭 처리
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'search' });

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
      imageUrl: c.imgUrl || '', // ✅ 썸네일
      content: '',
    }));
  }, [data]);

  // ✅ keyword로 필터링 (제목 기준)
  const filteredData: NewsItems[] = useMemo(() => {
    const kw = (keyword ?? '').trim().toLowerCase();
    if (!kw) return [];

    return allVisibleData.filter(item =>
      (item.title ?? '').toLowerCase().includes(kw),
    );
  }, [allVisibleData, keyword]);

  /**
   * ✅ 핵심 포인트
   * - 첫 페이지에 검색 결과가 없으면 "결과 없음"으로 보이니까
   * - 결과가 나올 때까지(또는 끝까지) 다음 페이지를 자동으로 더 가져오게 함
   */
  const autoFetchGuard = useRef(false);

  useEffect(() => {
    // keyword 바뀌면 가드 해제
    autoFetchGuard.current = false;
  }, [keyword]);

  useEffect(() => {
    if (isLoading || isRefetching || isFetchingNextPage) return;
    if (isError) return;

    const kw = (keyword ?? '').trim();
    if (!kw) return;

    // 결과가 아직 없고 다음 페이지가 있으면, 자동으로 더 받아오기
    if (filteredData.length === 0 && hasNextPage && !autoFetchGuard.current) {
      autoFetchGuard.current = true;
      fetchNextPage().finally(() => {
        // 다음 페이지를 받아온 뒤 다시 조건 평가할 수 있게 가드 해제
        autoFetchGuard.current = false;
      });
    }
  }, [
    keyword,
    filteredData.length,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    isError,
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <SearchHeader
          value={keyword ?? ''}
          readOnly
          goBackAction={() => navigation.goBack()}
          onPressBar={() => navigation.navigate(RouteNames.SEARCH_INPUT)}
        />

        {isLoading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={COLORS.puple.main}
          />
        ) : (
          <FlatList
            style={styles.list}
            data={filteredData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <SearchResultItem
                item={item}
                onPress={() => {
                  const parsed = Number(item.id);
                  if (Number.isNaN(parsed)) return;
                  handleArticlePress(parsed);
                }}
              />
            )}
            contentContainerStyle={styles.listContent}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              // 사용자가 더 내릴 때도 추가 로드
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
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
              <Text style={styles.empty}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  list: { flex: 1 },
  listContent: {
    paddingTop: scaleWidth(15),
    paddingBottom: scaleWidth(48),
    gap: scaleWidth(12),
  },
  empty: {
    textAlign: 'center',
    paddingTop: scaleWidth(40),
    color: COLORS.gray700,
  },
});
