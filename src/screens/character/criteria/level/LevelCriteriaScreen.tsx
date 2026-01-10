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
  Image,
} from 'react-native';
import { levelList, LevelCriteria } from './levelData';

import XpIcon from '../../../../assets/png/coin_xp.png';
import TooltipXP from '../../../../assets/png/Tooltip_XP.png';

import { InfoIcon } from '../../../../icons';

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

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * TooltipXP.png 기준
 * - 원본: 490 x 146
 * - "꼬리 tip"이 이미지 정중앙이 아니라 왼쪽에 있음 → tip X 기준으로 left 계산
 *   (값이 조금 틀리면 TOOLTIP_TIP_X만 미세 조정하면 됨)
 */
const TOOLTIP_ASSET_W = 490;
const TOOLTIP_ASSET_H = 146;

// ✅ 꼬리 tip X(원본 px) : 대략 이 근처에서 시작
// - 꼬리가 (i)보다 왼쪽이면 값을 "줄이면" 꼬리가 오른쪽으로 감
// - 꼬리가 (i)보다 오른쪽이면 값을 "늘리면" 꼬리가 왼쪽으로 감
const TOOLTIP_TIP_X = 143;

// ✅ 기존 tooltipWrap maxWidth(260) 유지
const TOOLTIP_W = scaleWidth(260);
const TOOLTIP_H = scaleWidth((260 * TOOLTIP_ASSET_H) / TOOLTIP_ASSET_W);

function useTooltip(autoHideMs: number) {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // leftArea 기준 너비(툴팁 clamp용)
  const [leftAreaWidth, setLeftAreaWidth] = useState(0);

  // ✅ 좌표계를 "xpLeft" 기준으로 맞추기 위해
  // - valueRowX: xpValueRow의 x (xpLeft 기준)
  // - iconX/iconW: xpValueRow 내부에서 info icon의 x/width
  const [valueRowX, setValueRowX] = useState(0);
  const [iconX, setIconX] = useState(0);
  const [iconW, setIconW] = useState(0);

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

  // ✅ xpLeft 기준 iconCenterX
  const iconCenterX = useMemo(
    () => valueRowX + iconX + iconW / 2,
    [valueRowX, iconX, iconW],
  );

  // ✅ "꼬리 tip"이 iconCenterX에 오도록 left 계산
  const tooltipLeft = useMemo(() => {
    if (!leftAreaWidth) return 0;

    const tipOffsetX = (TOOLTIP_W * TOOLTIP_TIP_X) / TOOLTIP_ASSET_W;
    const raw = iconCenterX - tipOffsetX;

    return clamp(raw, 0, leftAreaWidth - TOOLTIP_W);
  }, [leftAreaWidth, iconCenterX]);

  const onLayoutLeftArea = (e: LayoutChangeEvent) =>
    setLeftAreaWidth(e.nativeEvent.layout.width);

  // xpValueRow의 x를 xpLeft 기준으로 저장
  const onLayoutValueRow = (e: LayoutChangeEvent) => {
    const { x } = e.nativeEvent.layout;
    setValueRowX(x);
  };

  // xpValueRow 내부에서 info icon의 x/width 저장
  const onLayoutIcon = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setIconX(x);
    setIconW(width);
  };

  return {
    visible,
    toggle,
    tooltipLeft,
    onLayoutLeftArea,
    onLayoutValueRow,
    onLayoutIcon,
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

        {/* ✅ valueRow 좌표 측정 추가(기존 스타일/마진 유지) */}
        <Pressable
          onPress={tooltip.toggle}
          style={styles.xpValueRow}
          onLayout={tooltip.onLayoutValueRow}
        >
          <Text style={styles.xpNumber}>{currentXp}</Text>
          <Text style={styles.xpUnit}> XP</Text>

          {/* ✅ icon 좌표 측정은 icon wrapper에 */}
          <View style={styles.xpInfoIcon} onLayout={tooltip.onLayoutIcon}>
            <InfoIcon
              width={scaleWidth(22)}
              height={scaleWidth(22)}
              color={COLORS.gray400}
            />
          </View>
        </Pressable>

        {/* ✅ 툴팁: PNG만 적용 (top은 기존 tooltipWrap 그대로 사용) */}
        {tooltip.visible && (
          <View
            style={[
              styles.tooltipWrap,
              {
                left: tooltip.tooltipLeft,
                width: TOOLTIP_W,
                height: TOOLTIP_H,

                // PNG를 쓰니까 툴팁 박스 스타일만 여기서 무력화
                backgroundColor: 'transparent',
                paddingHorizontal: 0,
                paddingVertical: 0,
                borderRadius: 0,
                maxWidth: undefined,
              },
            ]}
            pointerEvents="none"
          >
            <Image
              source={TooltipXP}
              style={styles.tooltipPng}
              resizeMode="stretch"
            />

            <Text style={styles.tooltipTextOverlay}>
              퀴즈, 글 읽기, 출석 등 다양한 활동으로{'\n'}
              경험치를 모을 수 있어요
            </Text>
          </View>
        )}

        <Text style={styles.xpHint}>
          다음 단계 달성을 위해서는{'\n'}
          <Text style={styles.xpHintStrong}>{needXp}XP</Text>가 더 필요해요
        </Text>
      </View>

      <View style={styles.xpImg}>
        <Image source={XpIcon} style={styles.xpImgIcon} resizeMode="contain" />
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
      <View style={styles.thumb}>{item.character()}</View>
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

const ItemSeparator = () => <View style={styles.separator} />;

const LevelCriteriaScreen = () => {
  const currentXp = 50;
  const currentLevelId = 1;

  const needXp = useMemo(() => {
    const next = levelList.find(l => l.id === currentLevelId + 1);
    if (!next) return 0;
    return Math.max(0, next.requiredExp - currentXp);
  }, [currentLevelId, currentXp]);

  const renderItem: ListRenderItem<LevelCriteria> = useCallback(
    ({ item }) => <LevelRow item={item} isMine={item.id === currentLevelId} />,
    [currentLevelId],
  );

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
      ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default LevelCriteriaScreen;

const styles = StyleSheet.create({
  listContent: {
    marginHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(32),
    paddingBottom: scaleWidth(64),
  },

  headerSpace: {
    height: scaleWidth(32),
  },

  separator: {
    height: scaleWidth(20),
  },

  xpCard: {
    padding: scaleWidth(20),
    borderRadius: BORDER_RADIUS[16],
    borderWidth: scaleWidth(1),
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },

  xpLeft: {
    flex: 1,
    position: 'relative',
  },

  xpQ: {
    ...Body_16SB,
    color: COLORS.black,
  },

  xpValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleWidth(16),
  },

  xpNumber: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },

  xpUnit: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },

  xpInfoIcon: {
    marginLeft: scaleWidth(12),
    width: scaleWidth(22),
    height: scaleWidth(22),
    alignItems: 'center',
    justifyContent: 'center',
  },

  xpInfoIconText: {
    ...Caption_12SB,
    color: COLORS.white,
  },

  // ✅ top/레이아웃은 기존 그대로 유지 (툴팁이 50XP 라인을 덮지 않게)
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

  tooltipPng: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },

  // PNG 내부 여백 기준 텍스트 위치(필요하면 top만 미세조정)
  tooltipTextOverlay: {
    position: 'absolute',
    left: scaleWidth(18),
    right: scaleWidth(18),
    top: scaleWidth(44),
    ...Caption_12M,
    color: COLORS.white,
    includeFontPadding: false,
  },

  xpHint: {
    ...Caption_14R,
    marginTop: scaleWidth(8),
    color: COLORS.gray700,
    includeFontPadding: false,
  },

  xpHintStrong: {
    color: COLORS.puple.main,
    lineHeight: scaleWidth(24),
    includeFontPadding: false,
  },

  xpImg: {
    width: scaleWidth(92),
    height: scaleWidth(92),
    borderRadius: BORDER_RADIUS[12],
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },

  thumb: {
    width: scaleWidth(110),
    height: scaleWidth(130),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
    marginRight: scaleWidth(24),
    alignItems: 'center',
    justifyContent: 'center',
  },

  textArea: {
    flex: 1,
    gap: scaleWidth(3),
  },

  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    ...Heading_18EB_Round,
    color: COLORS.black,
    flex: 1,
    marginRight: scaleWidth(8),
  },

  myLevelPill: {
    paddingVertical: scaleWidth(4),
    paddingHorizontal: scaleWidth(8),
    borderRadius: BORDER_RADIUS[30],
    backgroundColor: COLORS.puple[2],
  },

  myLevelText: {
    ...Caption_12SB,
    color: COLORS.puple.main,
  },

  summaryTitle: {
    ...Body_16M,
    color: COLORS.gray800,
  },

  xpImgIcon: {
    width: scaleWidth(92),
    height: scaleWidth(92),
  },
});
