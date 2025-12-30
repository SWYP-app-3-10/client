import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteProp, useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../routes';

import type {
  MainTabNavigationProp,
  SearchStackParamList,
} from '../../navigation/types';

import SearchResultSkeleton from './components/SearchResultSkeleton';
import CategoryTabs from './components/CategoryTabs';
import SearchResultItem from './components/SearchResultItem';

import { MOCK_NEWS, NewsCategory, NewsItems } from '../../data/mock/searchData';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';

import {
  Caption_12M,
  COLORS,
  Heading_24EB_Round,
  scaleWidth,
} from '../../styles/global';

/** 한 번에 추가로 보여줄 아이템 개수(페이지 단위) */
const PAGE_SIZE = 10;

/** 작은 버튼 UX 개선용 터치 영역 확장 */
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * SearchListFooter
 *
 * - 무한 스크롤 하단에 붙는 푸터 컴포넌트
 * - 로딩 중이면 스켈레톤을 PAGE_SIZE 만큼 노출
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
 * - "탐색" 탭의 메인 화면 (탭바 O)
 * - 카테고리 기반 기사 리스트 탐색
 * - 우측 검색 버튼 클릭 시
 *   → 탭바 없는 SearchInputScreen으로 이동
 */
export default function SearchScreen({
  route,
}: {
  route: RouteProp<SearchStackParamList, typeof RouteNames.SEARCH>;
}) {
  // 현재 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(
    '전체' as any,
  );

  // 탐색 탭 네비게이션 객체
  const navigation =
    useNavigation<MainTabNavigationProp<SearchStackParamList>>();

  // 현재 페이지 (무한 스크롤)
  const [page, setPage] = useState(1);

  // 추가 로딩 여부
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * 라우트 파라미터 반영
   * - 다른 화면에서 특정 카테고리로 진입했을 경우 초기값 설정
   */
  useEffect(() => {
    if (route.params?.initialCategory) {
      setSelectedCategory(route.params.initialCategory);
      setPage(1);
    }
  }, [route.params?.initialCategory]);

  /**
   * 상단 "탐색" 버튼
   * - 탐색 화면에서는 아무 동작 없음 (기획 유지)
   */
  const onPressExplore = () => {
    return;
  };

  /**
   * 타이머 캡슐 버튼
   * - 추후 기능 확장을 위한 placeholder
   */
  const onPressTimer = () => {
    console.log('[SearchScreen] timer pressed');
  };

  /**
   * 카테고리 기반 데이터 필터링
   * - "전체" 선택 시 모든 기사 노출
   */
  const filteredAll: NewsItems[] = useMemo(() => {
    return MOCK_NEWS.filter(item => {
      if ((selectedCategory as any) === '전체') return true;
      return item.category === selectedCategory;
    });
  }, [selectedCategory]);

  /**
   * 현재 페이지 기준으로 화면에 표시할 데이터만 슬라이스
   */
  const visibleData = useMemo(() => {
    return filteredAll.slice(0, page * PAGE_SIZE);
  }, [filteredAll, page]);

  // 추가로 불러올 데이터가 있는지 여부
  const hasMore = visibleData.length < filteredAll.length;

  /**
   * 무한 스크롤 로딩 처리
   * - 마지막 근처에 도달하면 다음 페이지 로드
   */
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    await new Promise<void>(resolve => setTimeout(resolve, 900));
    setPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  // 기사 클릭 시 상세 화면 이동
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'search' });

  /**
   * 우측 검색 버튼 클릭
   * - 탭바 없는 검색 입력 화면(SearchInputScreen)으로 이동
   */
  const goToSearchInput = () => {
    navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.SEARCH_INPUT,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* 탐색 모드 상단 헤더 */}
        <View style={styles.exploreHeaderRow}>
          <TouchableOpacity
            onPress={onPressExplore}
            style={styles.exploreTitleBtn}
            hitSlop={HIT_SLOP}
          >
            <Text style={styles.exploreTitleText}>탐색</Text>
          </TouchableOpacity>

          <View style={styles.centerWrap}>
            <TouchableOpacity
              onPress={onPressTimer}
              style={styles.timerPill}
              hitSlop={HIT_SLOP}
            >
              <Text style={styles.timerPillText}>16:41</Text>
              <View style={styles.timerPillIconBox} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={goToSearchInput}
            style={styles.searchSquareBtn}
            hitSlop={HIT_SLOP}
          >
            <View style={styles.searchSquare} />
          </TouchableOpacity>
        </View>

        {/* 카테고리 선택 탭 */}
        <View style={styles.tabsWrap}>
          <CategoryTabs
            categories={
              [
                '전체',
                '정치',
                '경제',
                '사회',
                '생활/문화',
                'IT/과학',
                '세계',
              ] as any
            }
            selected={selectedCategory as any}
            onSelect={(cat: any) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
          />
        </View>

        {/* 탐색 기사 리스트 */}
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
                  console.warn('[SearchScreen] invalid article id:', item.id);
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
          // 항상 리스트 최상단에 고정 노출되는 스켈레톤
          ListHeaderComponent={
            <View>
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================
  스타일
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  container: {
    flex: 1,
  },

  exploreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(8),
  },

  exploreTitleBtn: {
    minWidth: scaleWidth(44),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  exploreTitleText: {
    ...Heading_24EB_Round,
    color: COLORS.puple?.main,
  },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(34),
    borderRadius: scaleWidth(999),
    borderWidth: 1,
    borderColor: COLORS.gray500,
    backgroundColor: COLORS.white,
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
  },

  timerPillText: {
    ...Caption_12M,
    color: COLORS.gray700,
    marginRight: scaleWidth(4),
  },

  timerPillIconBox: {
    width: scaleWidth(18),
    height: scaleWidth(18),
    borderRadius: scaleWidth(3),
    backgroundColor: COLORS.gray300,
  },

  searchSquareBtn: {
    minWidth: scaleWidth(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  searchSquare: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    backgroundColor: COLORS.gray300,
  },

  tabsWrap: {
    paddingHorizontal: 0,
    paddingVertical: scaleWidth(10),
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
