import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RouteNames } from '../../../routes';
import type { FullScreenStackParamList } from '../../navigation/types';

import SearchHeader from './components/SearchHeader';
import SearchResultSkeleton from './components/SearchResultSkeleton';
import SearchResultItem from './components/SearchResultItem';

import { MOCK_NEWS, NewsItems } from '../../data/mock/searchData';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';

import { COLORS, scaleWidth } from '../../styles/global';

/** 한 번에 추가로 보여줄 아이템 개수(페이지 단위) */
const PAGE_SIZE = 10;

/**
 * SearchListFooter
 *
 * - FlatList 하단 푸터 컴포넌트
 * - 로딩 중이면 PAGE_SIZE만큼 스켈레톤을 노출
 * - 로딩이 아니면 최소 여백만 제공
 */
const SearchListFooter = ({ loading }: { loading: boolean }) => {
  if (!loading) return <View style={{ height: 10 }} />;

  return (
    <View>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <SearchResultSkeleton key={`sk-${i}`} />
      ))}
    </View>
  );
};

/**
 * SearchResultScreen
 *
 * - 검색 결과 화면 (탭바 없음, FullScreenStack)
 * - route.params.keyword로 필터링
 */
export default function SearchResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FullScreenStackParamList>>();
  const route =
    useRoute<
      RouteProp<FullScreenStackParamList, typeof RouteNames.SEARCH_RESULT>
    >();
  const { keyword } = route.params;

  /** 현재 페이지 */
  const [page, setPage] = useState(1);

  /** 추가 로딩 중 여부 */
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * 검색 필터링
   * - keyword 기준으로만 필터링
   */
  const filteredAll: NewsItems[] = useMemo(() => {
    const kw = keyword.toLowerCase();
    return MOCK_NEWS.filter(item =>
      (item.title + item.subtitle + item.content).toLowerCase().includes(kw),
    );
  }, [keyword]);

  /**
   * 현재 page에 맞춰 화면에 보여줄 데이터만 슬라이스
   */
  const visibleData = useMemo(() => {
    return filteredAll.slice(0, page * PAGE_SIZE);
  }, [filteredAll, page]);

  /** 더 불러올 데이터가 있는지 여부 */
  const hasMore = visibleData.length < filteredAll.length;

  /**
   * 무한 스크롤 로딩
   */
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    await new Promise<void>(resolve => setTimeout(resolve, 900));
    setPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  /** 기사 클릭 처리 */
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'search' });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* SearchInputScreen과 동일한 헤더 모양(읽기 전용) */}
        <SearchHeader
          value={keyword ?? ''}
          readOnly
          goBackAction={() => navigation.goBack()}
          onPressBar={() => navigation.navigate(RouteNames.SEARCH_INPUT)}
        />

        <FlatList
          style={styles.list}
          data={visibleData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SearchResultItem
              item={item}
              onPress={() => {
                const parsed = Number(item.id);
                if (Number.isNaN(parsed)) {
                  console.warn(
                    '[SearchResultScreen] invalid article id:',
                    item.id,
                  );
                  return;
                }
                handleArticlePress(parsed);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.6}
          onEndReached={loadMore}
          ListFooterComponent={<SearchListFooter loading={isLoadingMore} />}
          ListEmptyComponent={
            <Text style={styles.empty}>검색 결과가 없습니다.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================
  스타일 (기존 SearchScreen 스타일 유지 톤)
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  container: {
    flex: 1,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingTop: scaleWidth(15),
    paddingBottom: scaleWidth(48),
    gap: scaleWidth(12),
  },

  empty: {
    textAlign: 'center',
    paddingTop: scaleWidth(20),
    color: COLORS.gray700,
  },
});
