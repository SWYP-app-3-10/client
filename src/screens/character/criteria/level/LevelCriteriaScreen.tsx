// LevelCriteriaScreen.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  LayoutChangeEvent,
  ListRenderItem,
} from 'react-native';
import { levelList, LevelCriteria } from './levelData';

// XP 아이콘 SVG import
import XpIcon from '../../../../assets/svg/Coin_XP.svg';

// 공통 디자인 시스템
import {
  COLORS,
  BORDER_RADIUS,
  scaleWidth,
  Body_16SB,
  Caption_12M,
  Heading_24EB_Round,
  Caption_14R,
  Heading_18EB_Round,
  Caption_12SB,
  Body_16M,
} from '../../../../styles/global';

/**
 * value를 min~max 범위로 제한
 * → 툴팁 위치가 부모 영역을 벗어나지 않도록 보정
 */
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * ======================================
 * useTooltip
 *
 * 툴팁 전용 커스텀 훅
 *
 * - 툴팁 표시/숨김 토글
 * - 자동 닫힘 타이머 관리
 * - 말풍선과 꼬리가 아이콘 중앙을 가리키도록 위치 계산
 * ======================================
 */
function useTooltip(autoHideMs: number) {
  /** 툴팁 표시 여부 */
  const [visible, setVisible] = useState(false);

  /** 자동 닫힘 타이머 */
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 레이아웃 측정 값들
   * - leftAreaWidth : 툴팁이 포함된 영역 너비
   * - iconCenterX   : 정보 아이콘 중앙 좌표
   * - tooltipWidth  : 실제 툴팁 너비
   */
  const [leftAreaWidth, setLeftAreaWidth] = useState(0);
  const [iconCenterX, setIconCenterX] = useState(0);
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

  /**
   * XP 영역 클릭 시 토글
   * - 닫힘 → 열림 (+ 자동 닫힘)
   * - 열림 → 닫힘
   */
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
   * - 아이콘 중앙 기준
   * - 부모 영역 밖으로 나가지 않도록 clamp
   */
  const tooltipLeft = useMemo(() => {
    if (!leftAreaWidth || !tooltipWidth) return 0;

    const raw = iconCenterX - tooltipWidth / 2;
    return clamp(raw, 0, leftAreaWidth - tooltipWidth);
  }, [leftAreaWidth, tooltipWidth, iconCenterX]);

  /**
   * 툴팁 꼬리 위치
   * - 말풍선 내부 기준
   * - 아이콘 중앙을 가리키도록 계산
   */
  const arrowLeft = useMemo(() => {
    const ARROW_HALF = scaleWidth(6);
    return Math.max(scaleWidth(10), iconCenterX - tooltipLeft - ARROW_HALF);
  }, [iconCenterX, tooltipLeft]);

  /** 레이아웃 측정 콜백 */
  const onLayoutLeftArea = (e: LayoutChangeEvent) =>
    setLeftAreaWidth(e.nativeEvent.layout.width);

  const onLayoutIcon = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setIconCenterX(x + width / 2);
  };

  const onLayoutTooltip = (e: LayoutChangeEvent) =>
    setTooltipWidth(e.nativeEvent.layout.width);

  return {
    visible,
    toggle,
    tooltipLeft,
    arrowLeft,
    onLayoutLeftArea,
    onLayoutIcon,
    onLayoutTooltip,
  };
}

/**
 * ======================================
 * 상단 XP 요약 카드
 * ======================================
 */
function XpSummaryCard({
  currentXp,
  needXp,
}: {
  currentXp: number;
  needXp: number;
}) {
  const tooltip = useTooltip(1500);

  return (
    <View style={styles.xpCard}>
      <View style={styles.xpLeft} onLayout={tooltip.onLayoutLeftArea}>
        <Text style={styles.xpQ}>현재 나의 경험치는?</Text>

        <Pressable onPress={tooltip.toggle} style={styles.xpValueRow}>
          <Text style={styles.xpNumber}>{currentXp}</Text>
          <Text style={styles.xpUnit}> XP</Text>

          <View style={styles.xpInfoIcon} onLayout={tooltip.onLayoutIcon}>
            <Text style={styles.xpInfoIconText}>i</Text>
          </View>
        </Pressable>

        {tooltip.visible && (
          <View
            style={[styles.tooltipWrap, { left: tooltip.tooltipLeft }]}
            onLayout={tooltip.onLayoutTooltip}
          >
            <Text style={styles.tooltipText}>
              퀴즈, 글 읽기, 출석 등 다양한 활동으로{'\n'}
              경험치를 모을 수 있어요
            </Text>
            <View style={[styles.tooltipArrow, { left: tooltip.arrowLeft }]} />
          </View>
        )}

        <Text style={styles.xpHint}>
          다음 단계 달성을 위해서는{'\n'}
          <Text style={styles.xpHintStrong}>{needXp}XP</Text>가 더 필요해요
        </Text>
      </View>

      {/* 내부에 XP 아이콘 삽입 */}
      <View style={styles.xpImg}>
        <XpIcon width={scaleWidth(92)} height={scaleWidth(92)} />
      </View>
    </View>
  );
}

/**
 * ======================================
 * 레벨 리스트 아이템
 * ======================================
 */
function LevelRow({ item, isMine }: { item: LevelCriteria; isMine: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.thumb} />

      <View style={styles.textArea}>
        <View style={styles.rowTop}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          {isMine && (
            <View style={styles.myLevelPill}>
              <Text style={styles.myLevelText}>내 레벨</Text>
            </View>
          )}
        </View>

        <Text style={styles.summaryTitle}>{item.summaryTitle}</Text>
      </View>
    </View>
  );
}

/**
 * ======================================
 * Screen
 *
 * - 현재 경험치/레벨 정보를 보여주고, 레벨별 기준 목록을 렌더링하는 화면
 * - 상단: 현재 XP 및 다음 레벨까지 필요한 XP 안내 카드
 *    ■ TODO "N" <-> "XP" 분리 필요
 * - 하단: 전체 레벨 리스트(현재 레벨에는 "내 레벨" 배지 표시)
 * ======================================
 */
const LevelCriteriaScreen = () => {
  // TODO: 서버 연동 시 전역 상태로 교체
  const currentXp = 50;
  const currentLevelId = 1;

  /**
   * 다음 레벨까지 필요한 XP 계산
   * - 현재 XP / 레벨 변경 시에만 재계산
   */
  const needXp = useMemo(() => {
    const next = levelList.find(l => l.id === currentLevelId + 1);
    if (!next) return 0;
    return Math.max(0, next.requiredExp - currentXp);
  }, [currentLevelId, currentXp]);

  /** FlatList 아이템 렌더 함수 */
  const renderItem: ListRenderItem<LevelCriteria> = useCallback(
    ({ item }) => <LevelRow item={item} isMine={item.id === currentLevelId} />,
    [currentLevelId],
  );

  /** FlatList 헤더 */
  const Header = useMemo(
    () => (
      <>
        <XpSummaryCard currentXp={currentXp} needXp={needXp} />
        <View style={styles.headerSpace} />
      </>
    ),
    [currentXp, needXp],
  );

  return (
    <FlatList
      data={levelList}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

/**
 * ======================================
 * 상단 XP 요약 카드
 * ======================================
 */
function XpSummaryCard({
  currentXp,
  needXp,
}: {
  currentXp: number;
  needXp: number;
}) {
  const tooltip = useTooltip(1500);

  return (
    <View style={styles.xpCard}>
      <View style={styles.xpLeft} onLayout={tooltip.onLayoutLeftArea}>
        <Text style={styles.xpQ}>현재 나의 경험치는?</Text>

        <Pressable onPress={tooltip.toggle} style={styles.xpValueRow}>
          <Text style={styles.xpNumber}>{currentXp}</Text>
          <Text style={styles.xpUnit}> XP</Text>

          <View style={styles.xpInfoIcon} onLayout={tooltip.onLayoutIcon}>
            <Text style={styles.xpInfoIconText}>i</Text>
          </View>
        </Pressable>

        {tooltip.visible && (
          <View
            style={[styles.tooltipWrap, { left: tooltip.tooltipLeft }]}
            onLayout={tooltip.onLayoutTooltip}
          >
            <Text style={styles.tooltipText}>
              퀴즈, 글 읽기, 출석 등 다양한 활동으로{'\n'}
              경험치를 모을 수 있어요
            </Text>
            <View style={[styles.tooltipArrow, { left: tooltip.arrowLeft }]} />
          </View>
        )}

        <Text style={styles.xpHint}>
          다음 단계 달성을 위해서는{'\n'}
          <Text style={styles.xpHintStrong}>{needXp}XP</Text>가 더 필요해요
        </Text>
      </View>

      {/* 내부에 XP 아이콘 삽입 */}
      <View style={styles.xpImg}>
        <XpIcon width={scaleWidth(92)} height={scaleWidth(92)} />
      </View>
    </View>
  );
}

/**
 * ======================================
 * 레벨 리스트 아이템
 * ======================================
 */
function LevelRow({ item, isMine }: { item: LevelCriteria; isMine: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.thumb} />

      <View style={styles.textArea}>
        <View style={styles.rowTop}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          {isMine && (
            <View style={styles.myLevelPill}>
              <Text style={styles.myLevelText}>내 레벨</Text>
            </View>
          )}
        </View>

        <Text style={styles.summaryTitle}>{item.summaryTitle}</Text>
      </View>
    </View>
  );
}

/**
 * ======================================
 * Screen
>>>>>>> develop
 * ======================================
 */
const LevelCriteriaScreen = () => {
  // TODO: 서버 연동 시 전역 상태로 교체
  const currentXp = 50;
  const currentLevelId = 1;

  /**
   * 다음 레벨까지 필요한 XP 계산
   * - 현재 XP / 레벨 변경 시에만 재계산
   */
  const needXp = useMemo(() => {
    const next = levelList.find(l => l.id === currentLevelId + 1);
    if (!next) return 0;
    return Math.max(0, next.requiredExp - currentXp);
  }, [currentLevelId, currentXp]);

  /** FlatList 아이템 렌더 함수 */
  const renderItem: ListRenderItem<LevelCriteria> = useCallback(
    ({ item }) => <LevelRow item={item} isMine={item.id === currentLevelId} />,
    [currentLevelId],
  );

  /** FlatList 헤더 */
  const Header = useMemo(
    () => (
      <>
        <XpSummaryCard currentXp={currentXp} needXp={needXp} />
        <View style={styles.headerSpace} />
      </>
    ),
    [currentXp, needXp],
  );

  return (
    <FlatList
      data={levelList}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default LevelCriteriaScreen;

/**
 * ======================================
 * styles
 * ======================================
 */
const styles = StyleSheet.create({
  listContent: {
    paddingTop: scaleWidth(32), // 리스트 상단 패딩
    paddingBottom: scaleWidth(64), // 리스트 하단 패딩
  },

  headerSpace: {
    height: scaleWidth(32), // 헤더와 리스트 간 여백
  },

  separator: {
    height: scaleWidth(20), // 리스트 아이템 간 간격
  },

  // XP 카드 컨테이너
  xpCard: {
    padding: scaleWidth(20),
    borderRadius: BORDER_RADIUS[16],
    borderWidth: scaleWidth(1),
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // XP 카드 좌측 영역
  xpLeft: {
    flex: 1,
    position: 'relative',
  },

  // 질문 텍스트
  xpQ: {
    ...Body_16SB,
    color: COLORS.black,
  },

  // XP 값 라인
  xpValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleWidth(16),
  },

  // XP 숫자
  xpNumber: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },

  // XP 단위
  xpUnit: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },

  // 정보 아이콘
  xpInfoIcon: {
    marginLeft: scaleWidth(12),
    width: scaleWidth(22),
    height: scaleWidth(22),
    backgroundColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 아이콘 텍스트
  xpInfoIconText: {
    ...Caption_12SB,
    color: COLORS.white,
  },

  // 툴팁 말풍선
  tooltipWrap: {
    position: 'absolute',
    top: scaleWidth(84),
    backgroundColor: COLORS.puple.light,
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
    borderRadius: BORDER_RADIUS[12],
    maxWidth: scaleWidth(260),
    zIndex: 10,
  },

  // 툴팁 설명
  tooltipText: {
    ...Caption_12M,
    color: COLORS.white,
  },

  // 툴팁 꼬리
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
    borderBottomColor: COLORS.puple.light,
  },

  // 다음 XP 안내
  xpHint: {
    ...Caption_14R,
    marginTop: scaleWidth(8),
    color: COLORS.gray700,
  },

  // XP 강조
  xpHintStrong: {
    color: COLORS.puple.main,
  },

  // 우측 아이콘 영역
  xpImg: {
    width: scaleWidth(92),
    height: scaleWidth(92),
    borderRadius: BORDER_RADIUS[12],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 리스트 행
  row: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 레벨 썸네일
  thumb: {
    width: scaleWidth(110),
    height: scaleWidth(130),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray200,
    marginRight: scaleWidth(24),
  },

  // 텍스트 영역
  textArea: {
    flex: 1,
  },

  // 제목 + 배지
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // 레벨명
  title: {
    ...Heading_18EB_Round,
    color: COLORS.black,
    flex: 1,
    marginRight: scaleWidth(8),
  },

  // "내 레벨" 버튼
  myLevelPill: {
    paddingVertical: scaleWidth(4),
    paddingHorizontal: scaleWidth(8),
    borderRadius: BORDER_RADIUS[30],
    backgroundColor: COLORS.puple[3],
  },

  // 배지 텍스트
  myLevelText: {
    ...Caption_12SB,
    color: COLORS.puple.main,
  },

  // 레벨 요약 설명
  summaryTitle: {
    ...Body_16M,
    color: COLORS.gray800,
  },
});
