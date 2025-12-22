import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '../../navigation/types';
import { RouteNames } from '../../../routes';
import SearchResultSkeleton from './components/SearchResultSkeleton';
import { MOCK_NEWS, NewsCategory, NewsItems } from './search_mockData';
import SearchResultItem from './components/SearchResultItem';
import CategoryTabs from './components/CategoryTabs';

type Props = NativeStackScreenProps<
  SearchStackParamList,
  typeof RouteNames.SEARCH
>;

/** 한 번에 추가로 보여줄 아이템 개수(페이지 단위) */
const PAGE_SIZE = 10;

/** 터치 영역 확장(작은 아이콘 버튼 UX 개선) */
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

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
 * SearchScreen
 *
 * - 탐색(카테고리 기반) + 검색 결과 화면
 * - keyword가 있으면 "검색 모드", 없으면 "탐색 모드"
 * - 목록은 클라이언트 페이지네이션(무한 스크롤) 형태로 노출
 */
export default function SearchScreen({ navigation, route }: Props) {
  /** 현재 선택된 카테고리(탐색 모드에서 사용) */
  const [selectedCategory, setSelectedCategory] =
    useState<NewsCategory>('경제');

  /** 검색 키워드(있으면 검색 모드) */
  const [keyword, setKeyword] = useState<string | undefined>();

  /** 현재 페이지(클라이언트 페이지네이션) */
  const [page, setPage] = useState(1);

  /** 더 불러오는 중 여부(중복 호출 방지 및 스켈레톤 표시용) */
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /** keyword 존재 여부로 검색 모드 판단 */
  const isSearching = !!keyword;

  /**
   * 라우트 파라미터 반영
   * - initialCategory: 탐색 모드 진입 시 초기 카테고리 설정
   * - keyword: 검색 모드 진입/갱신 시 keyword 반영 및 page 초기화
   */
  useEffect(() => {
    if (route.params?.initialCategory) {
      setSelectedCategory(route.params.initialCategory);
    }
    if (route.params?.keyword !== undefined) {
      setKeyword(route.params.keyword);
      setPage(1);
    }
  }, [route.params?.initialCategory, route.params?.keyword]);

  /**
   * 뒤로가기 동작
   * - 검색 모드: keyword를 해제하고 탐색 모드로 복귀
   * - 탐색 모드: 부모 네비게이터로 뒤로 이동
   */
  const onPressBack = () => {
    if (keyword) {
      setKeyword(undefined);
      setPage(1);
      navigation.setParams({ keyword: undefined });
      return;
    }
    navigation.getParent()?.goBack();
  };

  /**
   * 선택된 카테고리 + keyword로 전체 데이터 필터링
   * - keyword는 title/subtitle/content를 합쳐 대소문자 무시 포함 검색
   */
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
   * - hasMore가 없거나 이미 로딩 중이면 중단
   * - 현재는 더미 딜레이로 로딩을 흉내냄
   * - 추후 서버 페이지네이션으로 교체 가능
   */
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    /*
      백엔드 연동 시 예시
      GET /news?category=...&keyword=...&page=page+1&size=10
    */
    await new Promise<void>(resolve => setTimeout(resolve, 900));

    setPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 헤더 영역 */}
        <View style={styles.header}>
          {/* 검색 모드일 때만 뒤로가기 표시(탐색 모드에서는 중앙 타이틀 정렬 유지) */}
          {isSearching ? (
            <TouchableOpacity
              onPress={onPressBack}
              style={styles.backBtn}
              hitSlop={HIT_SLOP}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 28 }} />
          )}

          {/* 화면 타이틀 */}
          <Text style={styles.headerTitle}>
            {isSearching ? `"${keyword}" 검색 결과` : '탐색'}
          </Text>

          {/* 검색 입력 화면으로 이동 */}
          <TouchableOpacity
            onPress={() => navigation.navigate(RouteNames.SEARCH_INPUT)}
            style={styles.iconBtn}
            hitSlop={HIT_SLOP}
          >
            <Text style={styles.icon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* 탐색 모드에서만 카테고리 탭 노출 */}
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

        {/* 검색/탐색 결과 리스트 */}
        <FlatList
          style={styles.list}
          data={visibleData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <SearchResultItem item={item} />}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 24 },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },

  iconBtn: { padding: 6 },
  icon: { fontSize: 18 },

  tabsWrap: {
    maxHeight: 52,
  },

  list: { flex: 1 },

  empty: { textAlign: 'center', paddingTop: 20, color: '#777' },

  listContent: {
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'stretch',
  },
});
