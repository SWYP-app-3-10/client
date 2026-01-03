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
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import type {
  MainTabNavigationProp,
  SearchStackParamList,
} from '../../navigation/types';

import SearchResultSkeleton from './components/SearchResultSkeleton';
import CategoryTabs from './components/CategoryTabs';
import SearchResultItem from './components/SearchResultItem';

import { NewsCategory, NewsItems } from '../../data/mock/searchData';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';
import {
  Caption_12M,
  COLORS,
  Heading_24EB_Round,
  scaleWidth,
} from '../../styles/global';

import InfoIcon from '../../assets/svg/Info.svg';
import SearchIcon from '../../assets/svg/ExploreSearch.svg';
import { useExploreContents } from '../../hooks/useExploreContents';

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function SearchScreen() {
  const navigation =
    useNavigation<MainTabNavigationProp<SearchStackParamList>>();

  // 1. 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<
    NewsCategory | '전체'
  >('전체');

  // 2. API 호출 (인자 없이 호출 -> 서버엔 전체 데이터 요청)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useExploreContents(); // ✅ 훅 수정으로 이제 안전하게 호출 가능

  // 3. 클라이언트 사이드 필터링 로직
  const visibleData: NewsItems[] = useMemo(() => {
    const pages = data?.pages ?? [];
    const allContents = pages
      .flatMap(p => p.contents)
      .map(c => ({
        id: String(c.contentId),
        category: c.categoryName as NewsCategory,
        title: c.title,
        subtitle: '',
        readTime: `${c.readingTime}분 소요`,
        content: '',
      }));

    if (selectedCategory === '전체') return allContents;
    return allContents.filter(item => item.category === selectedCategory);
  }, [data, selectedCategory]);

  // --- 타이머 & 툴팁 로직 ---
  const timerTooltip = useTooltip(1500);
  const [nextUpdateAt, setNextUpdateAt] = useState<Date>(() =>
    getNextUpdateAt(new Date()),
  );
  const [remainSec, setRemainSec] = useState<number>(() =>
    getRemainSeconds(new Date(), nextUpdateAt),
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      if (now.getTime() >= nextUpdateAt.getTime()) {
        const next = getNextUpdateAt(now);
        setNextUpdateAt(next);
        setRemainSec(getRemainSeconds(now, next));
        return;
      }
      setRemainSec(getRemainSeconds(now, nextUpdateAt));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextUpdateAt]);

  const timerText = useMemo(() => formatRemainText(remainSec), [remainSec]);
  const tooltipMinutes = useMemo(
    () => Math.max(0, Math.ceil(remainSec / 60)),
    [remainSec],
  );

  const { handleArticlePress } = useArticleNavigation({ returnTo: 'search' });

  const goToSearchInput = () => {
    navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.SEARCH_INPUT,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HeaderArea
          timerText={timerText}
          tooltip={timerTooltip}
          tooltipMinutes={tooltipMinutes}
          onSearch={goToSearchInput}
        />
        <FlatList
          style={styles.list}
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(_, i) => `sk-${i}`}
          renderItem={() => <SearchResultSkeleton />}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <HeaderArea
          timerText={timerText}
          tooltip={timerTooltip}
          tooltipMinutes={tooltipMinutes}
          onSearch={goToSearchInput}
        />
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
            onSelect={(cat: any) => setSelectedCategory(cat)}
          />
        </View>
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
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.puple.main}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isError
                ? '데이터를 가져오지 못했습니다.'
                : '해당 카테고리의 글이 없습니다.'}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

// --- Helper Functions (툴팁, 타이머 등 - 기존 보존) ---
function useTooltip(autoHideMs: number) {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [areaWidth, setAreaWidth] = useState(0);
  const [targetCenterX, setTargetCenterX] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const clearTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);
  const openWithAutoHide = useCallback(() => {
    clearTimer();
    setVisible(true);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, autoHideMs);
  }, [autoHideMs, clearTimer]);
  const toggle = useCallback(() => {
    setVisible(prev => {
      const next = !prev;
      clearTimer();
      if (next) openWithAutoHide();
      return next;
    });
  }, [clearTimer, openWithAutoHide]);
  const tooltipLeft = useMemo(() => {
    if (!areaWidth || !tooltipWidth) return 0;
    const raw = targetCenterX - tooltipWidth / 2;
    return clamp(raw, 0, areaWidth - tooltipWidth);
  }, [areaWidth, tooltipWidth, targetCenterX]);
  const arrowLeft = useMemo(
    () => Math.max(scaleWidth(10), targetCenterX - tooltipLeft - scaleWidth(6)),
    [targetCenterX, tooltipLeft],
  );
  return {
    visible,
    toggle,
    tooltipLeft,
    arrowLeft,
    onLayoutArea: (e: any) => setAreaWidth(e.nativeEvent.layout.width),
    onLayoutTarget: (e: any) => {
      const { x, width } = e.nativeEvent.layout;
      setTargetCenterX(x + width / 2);
    },
    onLayoutTooltip: (e: any) => setTooltipWidth(e.nativeEvent.layout.width),
  };
}
const UPDATE_HOURS = [3, 6, 9, 12, 15, 18, 21, 24] as const;
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
const getRemainSeconds = (now: Date, next: Date) =>
  Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
const formatRemainText = (remainSec: number) => {
  const h = Math.floor(remainSec / 3600);
  const m = Math.floor((remainSec % 3600) / 60);
  const s = remainSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(
    s,
  ).padStart(2, '0')}`;
};
const HeaderArea = ({ timerText, tooltip, tooltipMinutes, onSearch }: any) => (
  <View style={styles.exploreHeaderRow}>
    <View style={styles.exploreTitleBtn}>
      <Text style={styles.exploreTitleText}>탐색</Text>
    </View>
    <View style={styles.centerWrap} onLayout={tooltip.onLayoutArea}>
      <Pressable
        onPress={tooltip.toggle}
        style={styles.timerPill}
        hitSlop={HIT_SLOP}
        onLayout={tooltip.onLayoutTarget}
      >
        <Text style={styles.timerPillText}>{timerText}</Text>
        <View style={styles.timerPillIconBox}>
          <InfoIcon
            width={scaleWidth(18)}
            height={scaleWidth(18)}
            color={COLORS.gray700}
          />
        </View>
      </Pressable>
      {tooltip.visible && (
        <View
          style={[styles.tooltipWrap, { left: tooltip.tooltipLeft }]}
          onLayout={tooltip.onLayoutTooltip}
        >
          <Text style={styles.tooltipText}>
            {tooltipMinutes <= 0
              ? '지금 새로운 글을 확인할 수 있어요!'
              : `${tooltipMinutes}분 뒤에 새로운 글을 확인할 수 있어요!`}
          </Text>
          <View style={[styles.tooltipArrow, { left: tooltip.arrowLeft }]} />
        </View>
      )}
    </View>
    <TouchableOpacity
      onPress={onSearch}
      style={styles.searchSquareBtn}
      hitSlop={HIT_SLOP}
    >
      <View style={styles.searchIconWrap}>
        <SearchIcon
          width={scaleWidth(48)}
          height={scaleWidth(48)}
          color={COLORS.gray400}
        />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  exploreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(8),
    zIndex: 100,
    elevation: 100,
  },
  exploreTitleBtn: { minWidth: scaleWidth(44), justifyContent: 'center' },
  exploreTitleText: { ...Heading_24EB_Round, color: COLORS.puple?.main },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 100,
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
  },
  timerPillText: {
    ...Caption_12M,
    color: COLORS.gray700,
    marginRight: scaleWidth(4),
  },
  timerPillIconBox: { width: scaleWidth(18), height: scaleWidth(18) },
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
  tooltipText: { ...Caption_12M, color: COLORS.white },
  tooltipArrow: {
    position: 'absolute',
    top: -scaleWidth(6),
    width: 0,
    height: 0,
    borderLeftWidth: scaleWidth(6),
    borderRightWidth: scaleWidth(6),
    borderBottomWidth: scaleWidth(6),
    borderBottomColor: COLORS.gray800,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
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
  tabsWrap: { paddingVertical: scaleWidth(10) },
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
