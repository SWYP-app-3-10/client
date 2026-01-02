import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  LayoutChangeEvent,
  Pressable,
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

import InfoIcon from '../../assets/svg/Info.svg';
import SearchIcon from '../../assets/svg/ExploreSearch.svg';

/** 한 번에 추가로 보여줄 아이템 개수(페이지 단위) */
const PAGE_SIZE = 10;

/** 작은 버튼 UX 개선용 터치 영역 확장 */
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * value를 min~max 범위로 제한
 * → 툴팁 위치가 부모 영역을 벗어나지 않도록 보정
 */
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * ======================================
 * useTooltip
 * - 툴팁 표시/숨김 토글
 * - 자동 닫힘 타이머 관리
 * - 말풍선과 꼬리가 아이콘(타이머 캡슐) 중앙을 가리키도록 위치 계산
 * ======================================
 */
function useTooltip(autoHideMs: number) {
  /** 툴팁 표시 여부 */
  const [visible, setVisible] = useState(false);

  /** 자동 닫힘 타이머 */
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 레이아웃 측정 값들
   * - areaWidth    : 툴팁이 포함된 영역 너비
   * - targetCenterX: 타겟(타이머 캡슐) 중앙 좌표
   * - tooltipWidth : 실제 툴팁 너비
   */
  const [areaWidth, setAreaWidth] = useState(0);
  const [targetCenterX, setTargetCenterX] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);

  /** 기존 타이머 제거 */
  const clearTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  /** 툴팁 열기 + 자동 닫힘 예약 */
  const openWithAutoHide = useCallback(() => {
    clearTimer();
    setVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, autoHideMs);
  }, [autoHideMs, clearTimer]);

  /** 토글 */
  const toggle = useCallback(() => {
    setVisible(prev => {
      const next = !prev;
      clearTimer();
      if (next) openWithAutoHide();
      return next;
    });
  }, [clearTimer, openWithAutoHide]);

  /**
   * 툴팁 말풍선 좌측 위치
   * - 타겟 중앙 기준
   * - 부모 영역 밖으로 나가지 않도록 clamp
   */
  const tooltipLeft = useMemo(() => {
    if (!areaWidth || !tooltipWidth) return 0;
    const raw = targetCenterX - tooltipWidth / 2;
    return clamp(raw, 0, areaWidth - tooltipWidth);
  }, [areaWidth, tooltipWidth, targetCenterX]);

  /**
   * 툴팁 꼬리 위치
   * - 말풍선 내부 기준
   * - 타겟 중앙을 가리키도록 계산
   */
  const arrowLeft = useMemo(() => {
    const ARROW_HALF = scaleWidth(6);
    return Math.max(scaleWidth(10), targetCenterX - tooltipLeft - ARROW_HALF);
  }, [targetCenterX, tooltipLeft]);

  /** 레이아웃 측정 콜백 */
  const onLayoutArea = (e: LayoutChangeEvent) =>
    setAreaWidth(e.nativeEvent.layout.width);

  const onLayoutTarget = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTargetCenterX(x + width / 2);
  };

  const onLayoutTooltip = (e: LayoutChangeEvent) =>
    setTooltipWidth(e.nativeEvent.layout.width);

  return {
    visible,
    toggle,
    tooltipLeft,
    arrowLeft,
    onLayoutArea,
    onLayoutTarget,
    onLayoutTooltip,
  };
}

/**
 * ======================================
 * Timer Schedule (3, 6, 9, 12, 15, 18, 21, 24시 업데이트)
 * - 다음 업데이트 시각 계산
 * - 남은 시간(초) 계산
 * - UI 표시용 텍스트(HH:MM:SS) 포맷
 * ======================================
 */
const UPDATE_HOURS = [3, 6, 9, 12, 15, 18, 21, 24] as const;

/** 다음 업데이트 시각 계산 */
const getNextUpdateAt = (now: Date) => {
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  for (const hour of UPDATE_HOURS) {
    const candidate =
      hour === 24
        ? new Date(y, m, d + 1, 0, 0, 0, 0)
        : new Date(y, m, d, hour, 0, 0, 0);

    if (candidate.getTime() > now.getTime()) return candidate;
  }

  return new Date(y, m, d + 1, 0, 0, 0, 0);
};

/** 남은 초 계산 */
const getRemainSeconds = (now: Date, next: Date) =>
  Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));

/** 타이머 표시 텍스트 (HH:MM:SS) */
const formatRemainText = (remainSec: number) => {
  const h = Math.floor(remainSec / 3600);
  const m = Math.floor((remainSec % 3600) / 60);
  const s = remainSec % 60;

  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
};

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

  // 타이머 툴팁
  const timerTooltip = useTooltip(1500);

  // 타이머 상태 (다음 업데이트 시각 / 남은 초)
  const [nextUpdateAt, setNextUpdateAt] = useState<Date>(() =>
    getNextUpdateAt(new Date()),
  );
  const [remainSec, setRemainSec] = useState<number>(() =>
    getRemainSeconds(new Date(), nextUpdateAt),
  );

  /**
   * 업데이트 스케줄에 맞춰 타이머 동작
   * - 1초마다 남은 시간 갱신
   * - 0초가 되면 다음 업데이트 시각으로 자동 갱신
   */
  useEffect(() => {
    const tick = () => {
      const now = new Date();

      // nextUpdateAt이 지났거나(혹은 동일) 남은 시간이 0이면 다음 슬롯으로 갱신
      if (now.getTime() >= nextUpdateAt.getTime()) {
        const next = getNextUpdateAt(now);
        setNextUpdateAt(next);
        setRemainSec(getRemainSeconds(now, next));
        return;
      }

      setRemainSec(getRemainSeconds(now, nextUpdateAt));
    };

    // 최초 1회 즉시 동기화
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextUpdateAt]);

  // 타이머 표시 문자열
  const timerText = useMemo(() => formatRemainText(remainSec), [remainSec]);

  // 툴팁의 "n분"도 스케줄 타이머에 맞춤
  const tooltipMinutes = useMemo(() => {
    // 0초면 "지금" 처리할 수 있지만, 문구는 기존 스타일 유지 위해 최소 0분 표시 대응
    return Math.max(0, Math.ceil(remainSec / 60));
  }, [remainSec]);

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
   * - 누르면 툴팁 토글
   */
  const onPressTimer = () => {
    timerTooltip.toggle();
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* 탐색 모드 상단 헤더 */}
        <View style={styles.exploreHeaderRow}>
          <TouchableOpacity
            onPress={onPressExplore}
            style={styles.exploreTitleBtn}
            hitSlop={HIT_SLOP}
          />

          {/* 가운데 영역: 툴팁 기준 영역 */}
          <View style={styles.centerWrap} onLayout={timerTooltip.onLayoutArea}>
            <Pressable
              onPress={onPressTimer}
              style={styles.timerPill}
              hitSlop={HIT_SLOP}
              onLayout={timerTooltip.onLayoutTarget}
            >
              {/* 실제 타이머 텍스트 표시 */}
              <Text style={styles.timerPillText}>{timerText}</Text>

              {/* 아이콘 자리: View 박스 → SVG */}
              <View style={styles.timerPillIconBox}>
                <InfoIcon
                  width={scaleWidth(18)}
                  height={scaleWidth(18)}
                  color={COLORS.gray700}
                />
              </View>
            </Pressable>

            {/* 툴팁 */}
            {timerTooltip.visible && (
              <View
                style={[styles.tooltipWrap, { left: timerTooltip.tooltipLeft }]}
                onLayout={timerTooltip.onLayoutTooltip}
              >
                {/* "n분"을 타이머에 맞춰 동적 표시 */}
                <Text style={styles.tooltipText}>
                  {tooltipMinutes <= 0
                    ? '지금 새로운 글을 확인할 수 있어요!'
                    : `${tooltipMinutes}분 뒤에 새로운 글을 확인할 수 있어요!`}
                </Text>
                <View
                  style={[
                    styles.tooltipArrow,
                    { left: timerTooltip.arrowLeft },
                  ]}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={goToSearchInput}
            style={styles.searchSquareBtn}
            hitSlop={HIT_SLOP}
          >
            {/* 검색 아이콘 */}
            <View style={styles.searchIconWrap}>
              <SearchIcon
                width={scaleWidth(48)}
                height={scaleWidth(48)}
                color={COLORS.gray400}
              />
            </View>
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

    // 툴팁이 탭 위로 올라오도록 수정
    zIndex: 100,
    elevation: 100, // Android
    overflow: 'visible', // iOS
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
    position: 'relative',

    zIndex: 100,
    elevation: 100,
    overflow: 'visible',
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
  },

  // 툴팁
  tooltipWrap: {
    position: 'absolute',
    top: scaleWidth(42),
    backgroundColor: COLORS.gray800,
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
    borderRadius: scaleWidth(12),
    maxWidth: scaleWidth(280),
    zIndex: 999,
    elevation: 999,
  },

  tooltipText: {
    ...Caption_12M,
    color: COLORS.white,
  },

  tooltipArrow: {
    position: 'absolute',
    top: -scaleWidth(6),
    width: 0,
    height: 0,
    borderLeftWidth: scaleWidth(6),
    borderRightWidth: scaleWidth(6),
    borderBottomWidth: scaleWidth(6),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.gray800,
  },

  searchSquareBtn: {
    minWidth: scaleWidth(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  searchIconWrap: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    alignItems: 'center',
    justifyContent: 'center',
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
