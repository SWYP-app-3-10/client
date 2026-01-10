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

// 로딩 스켈레톤 / 카테고리 탭 / 리스트 아이템 컴포넌트
import SearchResultSkeleton from './components/SearchResultSkeleton';
import CategoryTabs from './components/CategoryTabs';
import SearchResultItem from './components/SearchResultItem';

// 화면에서 쓰는 데이터 타입(목데이터 타입 재사용)
import { NewsCategory, NewsItems } from '../../data/mock/searchData';

// 기사 상세 이동 훅
import { useArticleNavigation } from '../../hooks/useArticleNavigation';

// 공통 스타일 토큰
import { Caption_12M, COLORS, scaleWidth } from '../../styles/global';

// SVG 아이콘
import InfoIcon from '../../assets/svg/Info.svg';
import SearchIcon from '../../assets/svg/ExploreSearch.svg';

// 탐색 컨텐츠 조회(infinite query)
import { useExploreContents } from '../../hooks/useExploreContents';

// 버튼 터치 영역 확대
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

// 툴팁 위치 계산에 쓰는 clamp
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// UI 카테고리(한글) -> 서버 enum 매핑
const SERVER_CATEGORY_MAP: Record<string, string | undefined> = {
  전체: undefined,
  정치: 'POLITICS',
  경제: 'ECONOMY',
  사회: 'SOCIETY',
  '생활/문화': 'LIFE_CULTURE',
  'IT/과학': 'IT_SCIENCE',
  세계: 'WORLD',
};

export default function SearchScreen() {
  // 네비게이션 (탐색 탭 내부)
  const navigation =
    useNavigation<MainTabNavigationProp<SearchStackParamList>>();

  // 1) 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<
    NewsCategory | '전체'
  >('전체');

  // 2) 선택된 카테고리를 서버 파라미터(enum)로 변환
  const categoryParam = useMemo(
    () => SERVER_CATEGORY_MAP[selectedCategory],
    [selectedCategory],
  );

  // 3) 서버에서 탐색 컨텐츠 조회 (무한 스크롤)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useExploreContents(categoryParam);

  // 4) 서버 응답(페이지들)을 FlatList에서 쓰는 형태로 가공 + contentId 기준 중복 제거
  const visibleData: NewsItems[] = useMemo(() => {
    // pages: InfiniteQuery의 page 배열
    const pages = data?.pages ?? [];

    // 모든 페이지 contents를 한 배열로 펼침
    const allContents = pages.flatMap(p => p.contents ?? []);

    // contentId 기반으로 중복 제거 (이미 렌더된 글이면 제외)
    const uniqueContents = allContents.filter(
      (item, index, self) =>
        index === self.findIndex(t => t.contentId === item.contentId),
    );

    // 앱 UI에서 쓰는 NewsItems 형태로 매핑
    return uniqueContents.map(c => ({
      id: String(c.contentId),
      category: (c.categoryName || '전체') as any,
      title: c.title || '',
      subtitle: '',
      readTime: `${c.readingTime ?? 0}분 소요`,
      imageUrl: c.imgUrl || '',
      content: '',
    }));
  }, [data]);

  // 기사 클릭 시 상세로 이동(포인트/구매/모달 등 포함된 네비게이션 처리)
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'search' });

  // 오른쪽 검색 아이콘 클릭 시 검색 입력 화면으로 이동
  const goToSearchInput = () => {
    navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.SEARCH_INPUT,
    });
  };

  // 초기 로딩 상태: 헤더는 보여주고, 리스트는 스켈레톤 표시
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ExploreHeaderWithTimer onSearch={goToSearchInput} />
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

  // 일반 상태: 헤더 + 카테고리 탭 + 리스트
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ExploreHeaderWithTimer onSearch={goToSearchInput} />

        {/* 카테고리 탭 (선택 시 서버 파라미터가 바뀌어 쿼리 재조회) */}
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

        {/* 결과 리스트 */}
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
          // 바닥 근처 도달 시 다음 페이지 요청 (중복 호출 방지 조건 포함)
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          // 다음 페이지 로딩 중이면 하단 로딩 인디케이터 표시
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
          // Pull-to-refresh: 현재 쿼리 refetch
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.puple.main}
            />
          }
          // 데이터가 없거나 에러인 경우 안내 문구
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

// 타이머/툴팁 전용 헤더 컴포넌트
// 가운데 타이머 pill은 항상 화면 정중앙, 오른쪽 검색 아이콘은 20 여백 기준으로 배치됨
const ExploreHeaderWithTimer = React.memo(function ExploreHeaderWithTimer({
  onSearch,
}: {
  onSearch: () => void;
}) {
  // 툴팁(자동 숨김 포함) 관련 상태/계산
  const timerTooltip = useTooltip(1500);

  // 다음 업데이트 시각(3,6,9,...,24시 기준)과 남은 초 계산
  const [nextUpdateAt, setNextUpdateAt] = useState<Date>(() =>
    getNextUpdateAt(new Date()),
  );
  const [remainSec, setRemainSec] = useState<number>(() =>
    getRemainSeconds(new Date(), nextUpdateAt),
  );

  // 1초마다 tick 하면서 remainSec 갱신
  // nextUpdateAt을 지나면 다음 업데이트 시각을 재계산
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

  // 타이머 표시 포맷
  // 1시간 이상: hh:mm / 1시간 미만: mm:ss
  const timerText = useMemo(() => formatRemainText(remainSec), [remainSec]);

  // 툴팁 표시용 텍스트
  // 타이머와 일치하도록 분 계산은 floor(버림) 사용
  // 1시간 이상: h시간 m분 / 1시간 미만: m분
  const tooltipMinutes = useMemo(() => {
    const total = Math.max(0, remainSec);
    const h = Math.floor(total / 3600);

    if (h >= 1) {
      const m = Math.floor((total % 3600) / 60);
      return `${h}시간 ${m}분`;
    }

    const m = Math.floor(total / 60);
    return `${m}분`;
  }, [remainSec]);

  // "지금 확인" 문구 여부는 초 기준으로 판단 (정확)
  const isNow = remainSec <= 0;

  return (
    <HeaderArea
      timerText={timerText}
      tooltip={timerTooltip}
      tooltipMinutes={tooltipMinutes}
      isNow={isNow}
      onSearch={onSearch}
    />
  );
});

// 툴팁 제어 훅
// - visible 토글
// - 자동 숨김 타이머(autoHideMs)
// - 화면 가운데 기준으로 툴팁 및 화살표 위치 계산
function useTooltip(autoHideMs: number) {
  const [visible, setVisible] = useState(false);

  // 자동 숨김 타이머 ref
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 툴팁 위치 계산용 레이아웃 정보
  const [areaWidth, setAreaWidth] = useState(0);
  const [targetCenterX, setTargetCenterX] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);

  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  // visible 토글 + 자동 숨김 예약
  const toggle = useCallback(() => {
    setVisible(prev => {
      const next = !prev;
      clearTimer();
      if (next)
        hideTimerRef.current = setTimeout(() => setVisible(false), autoHideMs);
      return next;
    });
  }, [autoHideMs, clearTimer]);

  // 툴팁 왼쪽 위치: 타겟 중심 - 툴팁 절반, 단 화면 밖으로 나가지 않게 clamp
  const tooltipLeft = useMemo(() => {
    if (!areaWidth || !tooltipWidth) return 0;
    return clamp(targetCenterX - tooltipWidth / 2, 0, areaWidth - tooltipWidth);
  }, [areaWidth, tooltipWidth, targetCenterX]);

  // 화살표 위치: 타겟 중심이 가리키도록, 최소 여백은 scaleWidth(10) 정도 보장
  const arrowLeft = useMemo(
    () => Math.max(scaleWidth(10), targetCenterX - tooltipLeft - scaleWidth(6)),
    [targetCenterX, tooltipLeft],
  );

  return {
    visible,
    toggle,
    tooltipLeft,
    arrowLeft,
    // 가운데 영역(부모)의 너비
    onLayoutArea: (e: any) => setAreaWidth(e.nativeEvent.layout.width),
    // 타겟(타이머 pill)의 중심 좌표
    onLayoutTarget: (e: any) => {
      const { x, width } = e.nativeEvent.layout;
      setTargetCenterX(x + width / 2);
    },
    // 툴팁 자체 너비
    onLayoutTooltip: (e: any) => setTooltipWidth(e.nativeEvent.layout.width),
  };
}

// 업데이트는 하루 8번(3,6,9,12,15,18,21,24시)
// 24는 다음날 00시로 처리
const UPDATE_HOURS = [3, 6, 9, 12, 15, 18, 21, 24] as const;

// 현재 시각 기준으로 다음 업데이트 시각 계산
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

// next까지 남은 초 계산(음수 방지)
const getRemainSeconds = (now: Date, next: Date) =>
  Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));

// 타이머 표시 포맷
// 1시간 이상: hh:mm / 1시간 미만: mm:ss
const formatRemainText = (sec: number) => {
  const total = Math.max(0, sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h >= 1) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// 헤더 UI
// leftSpacer: 좌/우 폭을 맞춰 가운데 타이머 pill이 정확히 중앙에 오도록 함
const HeaderArea = ({
  timerText,
  tooltip,
  tooltipMinutes,
  isNow,
  onSearch,
}: any) => (
  <View style={styles.exploreHeaderRow}>
    <View style={styles.leftSpacer} />

    {/* 타이머 & 툴팁 영역 (정중앙 고정) */}
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

      {/* 툴팁 */}
      {tooltip.visible && (
        <View
          style={[styles.tooltipWrap, { left: tooltip.tooltipLeft }]}
          onLayout={tooltip.onLayoutTooltip}
        >
          <Text style={styles.tooltipText}>
            {isNow
              ? '지금 새로운 글을 확인할 수 있어요!'
              : `${tooltipMinutes} 뒤에 새로운 글을 확인할 수 있어요!`}
          </Text>
          <View style={[styles.tooltipArrow, { left: tooltip.arrowLeft }]} />
        </View>
      )}
    </View>

    {/* 오른쪽 검색 아이콘 버튼 */}
    <TouchableOpacity
      onPress={onSearch}
      style={styles.searchSquareBtn}
      hitSlop={HIT_SLOP}
    >
      <View style={styles.searchIconWrap}>
        <SearchIcon />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },

  // 헤더 한 줄 레이아웃
  // paddingHorizontal 20으로 양쪽 기본 여백 확보
  exploreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(8),
    zIndex: 100,
    elevation: 100,
  },

  // 왼쪽을 비워두되, 오른쪽 버튼(48)과 폭을 맞춰 가운데가 정확히 중앙에 오게 함
  leftSpacer: { width: scaleWidth(48) },

  // 가운데 타이머 영역
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 100,
  },

  // 타이머 pill UI
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

  // 툴팁 UI
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

  // 오른쪽 검색 버튼 영역
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

  // 카테고리 탭 영역
  tabsWrap: { paddingVertical: scaleWidth(10) },

  // 리스트 영역
  list: { flex: 1 },

  // 리스트 컨텐츠 여백/간격
  listContent: {
    paddingTop: scaleWidth(15),
    paddingBottom: scaleWidth(48),
    gap: scaleWidth(12),
  },

  // 빈 상태 문구
  empty: {
    textAlign: 'center',
    paddingTop: scaleWidth(40),
    color: COLORS.gray700,
  },
});
