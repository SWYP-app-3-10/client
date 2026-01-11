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

import { useExploreContents } from '../../hooks/useExploreContents';

import { COLORS, scaleWidth } from '../../styles/global';

/**
 * SearchResultScreen
 * - 검색 확정(엔터/검색 버튼) 후 결과 화면
 * - explore(전체) 데이터를 가져온 뒤 프론트에서 keyword로 필터링
 *
 * ✅참고
 * - 현재 백엔드 무한스크롤 미적용 상태: explore 전체가 1페이지(예: 10개)만 내려올 수 있음
 * - 이 경우 검색 결과도 첫 페이지 데이터 범위에서만 매칭됨
 * - 백엔드가 nextBatchTime 기반 페이지네이션을 붙이면 hasNextPage가 true가 되고,
 *   아래 자동 fetchNextPage 로직으로 "결과가 나올 때까지" 추가 로드 가능
 */
export default function SearchResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FullScreenStackParamList>>();
  const route =
    useRoute<
      RouteProp<FullScreenStackParamList, typeof RouteNames.SEARCH_RESULT>
    >();
  const { keyword } = route.params;

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

  // 기사 클릭 시 상세 이동(포인트/구매/모달 로직 포함)
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'search' });

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

  // keyword 기준(제목 포함)으로 필터링
  const filteredData: NewsItems[] = useMemo(() => {
    const kw = (keyword ?? '').trim().toLowerCase();
    if (!kw) return [];

    return allVisibleData.filter(item =>
      (item.title ?? '').toLowerCase().includes(kw),
    );
  }, [allVisibleData, keyword]);

  // 첫 페이지에 결과가 없을 때 다음 페이지를 자동으로 더 받아오도록 준비
  // (현재 백엔드 미적용이면 hasNextPage=false라 동작하지 않음)
  const autoFetchGuard = useRef(false);

  useEffect(() => {
    autoFetchGuard.current = false;
  }, [keyword]);

  useEffect(() => {
    if (isLoading || isRefetching || isFetchingNextPage) return;
    if (isError) return;

    const kw = (keyword ?? '').trim();
    if (!kw) return;

    if (filteredData.length === 0 && hasNextPage && !autoFetchGuard.current) {
      autoFetchGuard.current = true;
      fetchNextPage().finally(() => {
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
              // 사용자 스크롤로 추가 로드(백엔드 페이지네이션 적용 시에만 의미 있음)
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
