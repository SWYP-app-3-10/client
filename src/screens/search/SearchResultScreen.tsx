import React from 'react';
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

import { NewsItems } from '../../data/mock/searchData';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';
import { useSearchContents } from '../../hooks/useSearchContents';

import { COLORS, scaleWidth } from '../../styles/global';

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

  /**
   * 실제 API 무한 스크롤 호출
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSearchContents({ keyword });

  /**
   * 서버 데이터를 UI 규격에 맞춰 가공
   */
  const visibleData: NewsItems[] = (
    data?.pages.flatMap(page => page) ?? []
  ).map(item => ({
    id: String(item.contentId),
    category: item.categoryName as any,
    title: item.title,
    subtitle: '',
    readTime: `${item.readingTime}분 소요`,
    content: '',
  }));

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

        {isLoading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={COLORS.puple.main}
          />
        ) : (
          <FlatList
            style={styles.list}
            data={visibleData}
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
            onEndReached={() => hasNextPage && fetchNextPage()}
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
