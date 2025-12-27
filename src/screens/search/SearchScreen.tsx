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
import {
  MainTabNavigationProp,
  SearchStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';

import SearchResultSkeleton from './components/SearchResultSkeleton';
import { MOCK_NEWS, NewsCategory, NewsItems } from '../../data/mock/searchData';
import SearchResultItem from './components/SearchResultItem';
import CategoryTabs from './components/CategoryTabs';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';

import {
  Caption_12M,
  COLORS,
  Heading_24EB_Round,
  scaleWidth,
} from '../../styles/global';

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
 * - 검색 모드에서는 카테고리 무시하고 keyword 기준으로만 필터링
 * - 탐색 탭에서는 "전체" 포함
 */
export default function SearchScreen({
  route,
}: {
  route: RouteProp<SearchStackParamList, 'search'>;
}) {
  /** 현재 선택된 카테고리(탐색 모드에서 사용) */
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(
    '전체' as any,
  );

  /** 네비게이션 객체 */
  const navigation =
    useNavigation<MainTabNavigationProp<SearchStackParamList>>();

  /** 검색 키워드(있으면 검색 모드) */
  const [keyword, setKeyword] = useState<string | undefined>();

  /** 현재 페이지 */
  const [page, setPage] = useState(1);

  /** 추가 로딩 중 여부 */
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /** 검색 모드 여부 */
  const isSearching = !!keyword;

  /**
   * 라우트 파라미터 반영
   * - initialCategory: 탐색 모드 진입 시 초기 카테고리 지정
   * - keyword: 검색 결과 화면 진입/갱신
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
   * 검색 모드에서 뒤로가기
   * - goBack() 쓰면 탭 구조에 따라 다른 탭으로 튈 수 있어
   * - 같은 화면에서 keyword만 해제해서 탐색 모드로 복귀
   */
  const onPressBackFromSearch = () => {
    setKeyword(undefined);
    setPage(1);
    navigation.setParams({ keyword: undefined });
  };

  /**
   * 탐색 상단 "탐색" 버튼 동작
   * - 탐색 화면에서는 눌러도 아무 것도 안 함(기획 유지)
   */
  const onPressExplore = () => {
    return;
  };

  /**
   * 타이머 버튼 동작(중앙 캡슐)
   * - 추후 구현 예정
   */
  const onPressTimer = () => {
    console.log('[SearchScreen] timer pressed');
  };

  /**
   * 데이터 필터링
   * - 검색 모드: keyword로만 필터링 (카테고리 무시)
   * - 탐색 모드: selectedCategory로 필터링 (전체면 전부 노출)
   */
  const filteredAll: NewsItems[] = useMemo(() => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      return MOCK_NEWS.filter(item =>
        (item.title + item.subtitle + item.content).toLowerCase().includes(kw),
      );
    }

    return MOCK_NEWS.filter(item => {
      if ((selectedCategory as any) === '전체') return true;
      return item.category === selectedCategory;
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {isSearching ? (
          <View style={styles.searchHeaderRow}>
            <TouchableOpacity
              onPress={onPressBackFromSearch}
              style={styles.backBtn}
              hitSlop={HIT_SLOP}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.searchBarWrap}>
              <Text style={styles.searchBarText}>{keyword}</Text>
            </View>
          </View>
        ) : (
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
              onPress={() => navigation.navigate(RouteNames.SEARCH_INPUT)}
              style={styles.searchSquareBtn}
              hitSlop={HIT_SLOP}
            >
              <View style={styles.searchSquare} />
            </TouchableOpacity>
          </View>
        )}

        {!isSearching && (
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
        )}

        <FlatList
          style={styles.list}
          data={visibleData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SearchResultItem
              item={item}
              onPress={() => handleArticlePress(Number(item.id))}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.6}
          onEndReached={loadMore}
          ListFooterComponent={<SearchListFooter loading={isLoadingMore} />}
          ListEmptyComponent={
            <Text style={styles.empty}>검색 결과가 없습니다.</Text>
          }
          /* ✅ 항상 상단에 스켈레톤 2개 고정(원래 리스트 위) */
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
  // SafeAreaView 기본 배경/크기
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // 화면 컨테이너
  container: {
    flex: 1,
  },

  // 검색 모드 헤더 행(뒤로 + 검색바)
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
  },

  // 검색 헤더 뒤로가기 버튼 영역
  backBtn: {
    paddingRight: scaleWidth(10),
    paddingVertical: scaleWidth(6),
  },

  // 검색 헤더 뒤로가기 아이콘 텍스트
  backText: {
    fontSize: scaleWidth(26),
    color: COLORS.black,
    lineHeight: scaleWidth(28),
  },

  // 검색바(표시용) 래퍼
  searchBarWrap: {
    flex: 1,
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: COLORS.gray100,
    paddingHorizontal: scaleWidth(14),
    justifyContent: 'center',
  },

  // 검색바 텍스트(검색어 표시)
  searchBarText: {
    fontSize: scaleWidth(14),
    fontWeight: '600',
    color: COLORS.black,
  },

  // 탐색 모드 헤더 행(좌=탐색, 중=타이머, 우=검색)
  exploreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
  },

  // "탐색" 타이틀 버튼 영역
  exploreTitleBtn: {
    minWidth: scaleWidth(44),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  // "탐색" 타이틀 텍스트
  exploreTitleText: {
    ...Heading_24EB_Round,
    color: COLORS.puple?.main,
  },

  // 타이머 캡슐을 가운데 고정하기 위한 래퍼
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 타이머 캡슐 버튼
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

  // 타이머 시간 텍스트
  timerPillText: {
    ...Caption_12M,
    color: COLORS.gray700,
    marginRight: scaleWidth(4),
  },

  // 타이머 캡슐 오른쪽 네모(아이콘 자리)
  timerPillIconBox: {
    width: scaleWidth(18),
    height: scaleWidth(18),
    borderRadius: scaleWidth(3),
    backgroundColor: COLORS.gray300,
  },

  // 우측 검색 버튼(터치 영역 포함)
  searchSquareBtn: {
    minWidth: scaleWidth(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  // 우측 검색 버튼(임시 회색 네모)
  searchSquare: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    backgroundColor: COLORS.gray300,
  },

  // 카테고리 탭 영역 래퍼
  tabsWrap: {
    paddingHorizontal: 0,
    paddingVertical: scaleWidth(10),
  },

  // 리스트 영역
  list: {
    flex: 1,
  },

  // 리스트 content 영역(위/아래 여백 + 아이템 간격)
  listContent: {
    paddingTop: scaleWidth(15),
    paddingBottom: scaleWidth(48),
    gap: scaleWidth(12),
  },

  // 검색 결과가 없을 때 안내 텍스트
  empty: {
    textAlign: 'center',
    paddingTop: scaleWidth(20),
    color: COLORS.gray700,
  },
});
