import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SearchStackParamList} from '../../navigation/types';
import {RouteNames} from '../../../routes';

import {MOCK_NEWS, NewsCategory, NewsItems} from './search/search_mockData';
import CategoryTabs from './search/components/CategoryTabs';
import SearchResultItem from './search/components/SearchResultItem';
import SearchResultSkeleton from './search/components/SearchResultSkeleton';

type Props = NativeStackScreenProps<
  SearchStackParamList,
  typeof RouteNames.SEARCH
>;

const PAGE_SIZE = 10;

export default function SearchScreen({navigation, route}: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState<NewsCategory>('경제');
  const [keyword, setKeyword] = useState<string | undefined>();

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isSearching = !!keyword;

  useEffect(() => {
    if (route.params?.initialCategory) {
      setSelectedCategory(route.params.initialCategory);
    }
    if (route.params?.keyword !== undefined) {
      setKeyword(route.params.keyword);
      setPage(1);
    }
  }, [route.params?.initialCategory, route.params?.keyword]);

  const onPressBack = () => {
    if (keyword) {
      setKeyword(undefined);
      setPage(1);
      navigation.setParams({keyword: undefined});
      return;
    }
    navigation.getParent()?.goBack();
  };

  const filteredAll: NewsItems[] = useMemo(() => {
    return MOCK_NEWS.filter(item => {
      const catOk = item.category === selectedCategory;

      const kwOk = keyword
        ? (item.title + item.subtitle + item.content)
            .toLowerCase()
            .includes(keyword.toLowerCase())
        : true;

      return catOk && kwOk;
    });
  }, [selectedCategory, keyword]);

  const visibleData = useMemo(() => {
    return filteredAll.slice(0, page * PAGE_SIZE);
  }, [filteredAll, page]);

  const hasMore = visibleData.length < filteredAll.length;

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    // ---------------------------------------------------------
    // [백엔드 연동 시 확인]
    // GET /news?category=...&keyword=...&page=page+1&size=10
    // ---------------------------------------------------------
    await new Promise(r => setTimeout(r, 900));

    setPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  const ListFooter = () => {
    if (!isLoadingMore) return <View style={{height: 10}} />;
    return (
      <View>
        {Array.from({length: PAGE_SIZE}).map((_, i) => (
          <SearchResultSkeleton key={`sk-${i}`} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          {isSearching ? (
            <TouchableOpacity
              onPress={onPressBack}
              style={styles.backBtn}
              hitSlop={HIT_SLOP}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={{width: 28}} />
          )}

          <Text style={styles.headerTitle}>
            {isSearching ? `"${keyword}" 검색 결과` : '탐색'}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate(RouteNames.SEARCH_INPUT)}
            style={styles.iconBtn}
            hitSlop={HIT_SLOP}>
            <Text style={styles.icon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {!isSearching && (
          <View style={styles.tabsWrap}>
            <CategoryTabs
              categories={[
                '정치',
                '경제',
                '사회',
                '생활/문화',
                'IT/과학',
                '세계',
              ]}
              selected={selectedCategory}
              onSelect={cat => {
                setSelectedCategory(cat);
                setPage(1);
              }}
            />
          </View>
        )}

        {/* 리스트 */}
        <FlatList
          style={styles.list}
          data={visibleData}
          keyExtractor={item => item.id}
          renderItem={({item}) => <SearchResultItem item={item} />}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.6}
          onEndReached={loadMore}
          ListFooterComponent={<ListFooter />}
          ListEmptyComponent={
            <Text style={styles.empty}>검색 결과가 없습니다.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const HIT_SLOP = {top: 10, bottom: 10, left: 10, right: 10};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: 'white'},
  container: {flex: 1},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  backBtn: {padding: 4},
  backText: {fontSize: 24},

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },

  iconBtn: {padding: 6},
  icon: {fontSize: 18},

  tabsWrap: {
    maxHeight: 52,
  },

  // ✅ FlatList가 남는 공간을 먹고, 아이템이 위에서부터 쌓이도록
  list: {flex: 1},

  empty: {textAlign: 'center', paddingTop: 20, color: '#777'},

  listContent: {
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'stretch',
  },
});
