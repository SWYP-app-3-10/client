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

import { COLORS, scaleWidth } from '../../styles/global';

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
  // 로딩이 아니면 여백만 주고 끝
  if (!loading) return <View style={{ height: 10 }} />;

  // 로딩이면 스켈레톤을 PAGE_SIZE만큼 렌더링
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
    // 탐색 진입 시 초기 카테고리 파라미터가 있으면 반영
    if (route.params?.initialCategory) {
      setSelectedCategory(route.params.initialCategory);
    }

    // 검색 진입/갱신 시 keyword 반영 + 페이지 초기화
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
    setKeyword(undefined); // 검색 모드 해제
    setPage(1); // 페이지 초기화
    navigation.setParams({ keyword: undefined }); // params 정리
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
    // 검색 모드면: 카테고리 무시, keyword 포함 여부만 확인
    if (keyword) {
      const kw = keyword.toLowerCase();
      return MOCK_NEWS.filter(item =>
        (item.title + item.subtitle + item.content).toLowerCase().includes(kw),
      );
    }

    // 탐색 모드면: 전체면 전부, 아니면 카테고리 매칭
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
        {/* =========================
            헤더
            - 검색 모드: 검색바 형태
            - 탐색 모드: 탐색/타이머/검색버튼
        ========================= */}

        {isSearching ? (
          // ===== 검색 결과 상단 =====
          <View style={styles.searchHeaderRow}>
            {/* 왼쪽: 뒤로가기 -> 탐색 모드로 복귀 */}
            <TouchableOpacity
              onPress={onPressBackFromSearch}
              style={styles.backBtn}
              hitSlop={HIT_SLOP}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            {/* 가운데: 검색바(표시용) */}
            <View style={styles.searchBarWrap}>
              <Text style={styles.searchBarText}>{keyword}</Text>
            </View>
          </View>
        ) : (
          // ===== 탐색 상단 =====
          <View style={styles.exploreHeaderRow}>
            {/* 왼쪽: 탐색 */}
            <TouchableOpacity
              onPress={onPressExplore}
              style={styles.exploreTitleBtn}
              hitSlop={HIT_SLOP}
            >
              <Text style={styles.exploreTitleText}>탐색</Text>
            </TouchableOpacity>

            {/* 가운데: 타이머 캡슐 */}
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

            {/* 오른쪽: 검색 버튼(회색 네모 임시) */}
            <TouchableOpacity
              onPress={() => navigation.navigate(RouteNames.SEARCH_INPUT)}
              style={styles.searchSquareBtn}
              hitSlop={HIT_SLOP}
            >
              <View style={styles.searchSquare} />
            </TouchableOpacity>
          </View>
        )}

        {/* ===== 탐색 모드에서만 카테고리 탭 노출 ===== */}
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

        {/* ===== 리스트 ===== */}
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
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================
   스타일 (자세한 주석)
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1, // 전체 화면
    backgroundColor: COLORS.white, // 배경 흰색
  },

  container: {
    flex: 1, // 내부 채우기
  },

  /* =========================
     검색 헤더
  ========================= */
  searchHeaderRow: {
    flexDirection: 'row', // 뒤로 + 검색바를 가로로 배치
    alignItems: 'center', // 수직 중앙 정렬
    height: scaleWidth(52), // 헤더 높이
    paddingHorizontal: scaleWidth(20), // 좌우 여백
  },

  backBtn: {
    paddingRight: scaleWidth(10), // 뒤로 버튼과 검색바 간격
    paddingVertical: scaleWidth(6), // 터치 영역 확보
  },

  backText: {
    fontSize: scaleWidth(26), // chevron 크기
    color: COLORS.black, // 색
    lineHeight: scaleWidth(28), // 정렬 안정
  },

  searchBarWrap: {
    flex: 1, // 검색바가 남은 공간 전부 차지
    height: scaleWidth(40), // 검색바 높이
    borderRadius: scaleWidth(20), // 캡슐 형태
    backgroundColor: COLORS.gray100, // 연한 회색 배경
    paddingHorizontal: scaleWidth(14), // 내부 좌우 여백
    justifyContent: 'center', // 텍스트 수직 중앙
  },

  searchBarText: {
    fontSize: scaleWidth(14), // 검색어 텍스트 크기
    fontWeight: '600', // 약간 굵게
    color: COLORS.black, // 텍스트 색
  },

  /* =========================
    탐색 헤더
  ========================= */
  exploreHeaderRow: {
    flexDirection: 'row', // 좌/중/우를 가로로 배치
    alignItems: 'center', // 수직 중앙
    height: scaleWidth(52), // 헤더 높이
    paddingHorizontal: scaleWidth(20), // 좌우 여백
  },

  exploreTitleBtn: {
    minWidth: scaleWidth(44), // 최소 터치 폭 확보
    alignItems: 'flex-start', // 왼쪽 정렬
    justifyContent: 'center', // 세로 중앙
  },

  exploreTitleText: {
    fontSize: scaleWidth(20), // “탐색” 크게
    fontWeight: '800', // 두껍게
    color: COLORS.puple?.main ?? '#6C5CE7', // 퍼플 포인트 컬러
  },

  centerWrap: {
    flex: 1, // 가운데 영역이 남는 공간 차지
    alignItems: 'center', // 가운데 정렬
    justifyContent: 'center', // 수직 중앙
  },

  timerPill: {
    flexDirection: 'row', // 시간 + 네모를 가로로 배치
    alignItems: 'center', // 수직 중앙
    height: scaleWidth(34), // 캡슐 높이
    borderRadius: scaleWidth(999), // 완전 둥근 캡슐
    borderWidth: 1, // 테두리 두께
    borderColor: COLORS.gray300, // 테두리 색
    backgroundColor: COLORS.white, // 배경
    paddingHorizontal: scaleWidth(14), // 좌우 여백
  },

  timerPillText: {
    fontSize: scaleWidth(14), // 시간 텍스트 크기
    fontWeight: '600', // 중간 굵기
    color: COLORS.gray700, // 회색 텍스트
    marginRight: scaleWidth(10), // 텍스트와 네모 간격
  },

  timerPillIconBox: {
    width: scaleWidth(18), // 오른쪽 네모 폭
    height: scaleWidth(18), // 오른쪽 네모 높이
    borderRadius: scaleWidth(3), // 살짝 둥근 네모
    backgroundColor: COLORS.gray300, // 회색 네모
  },

  searchSquareBtn: {
    minWidth: scaleWidth(44), // 터치 영역 확보
    alignItems: 'flex-end', // 오른쪽 끝 정렬
    justifyContent: 'center', // 세로 중앙
  },

  searchSquare: {
    width: scaleWidth(24), // 임시 버튼 크기
    height: scaleWidth(24), // 임시 버튼 크기
    borderRadius: scaleWidth(4), // 모서리 둥글게
    backgroundColor: COLORS.gray300, // 연한 회색
  },

  /* =========================
    카테고리 탭 래퍼
  ========================= */
  tabsWrap: {
    paddingHorizontal: 0, // CategoryTabs에서 padding 20을 주므로 여기서는 0(이중 패딩 방지)
    paddingVertical: scaleWidth(10), // 탭 영역 위아래 여백
  },

  /* =========================
    리스트 영역
  ========================= */
  list: {
    flex: 1, // 리스트가 남는 영역 차지
  },

  listContent: {
    paddingTop: scaleWidth(8), // 첫 아이템 위 여백
    paddingBottom: scaleWidth(12), // 마지막 아래 여백
  },

  empty: {
    textAlign: 'center', // 가운데 정렬
    paddingTop: scaleWidth(20), // 위 여백
    color: COLORS.gray700, // 회색 안내 문구
  },
});
