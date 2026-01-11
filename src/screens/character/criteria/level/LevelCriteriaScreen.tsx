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
  findNodeHandle,
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
  Heading_24EB_Round,
  Caption_14R,
  Heading_18EB_Round,
  Caption_12SB,
  Body_16M,
} from '../../../../styles/global';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * TooltipXP.png 기준 (그대로)
 */
const TOOLTIP_ASSET_W = 490;
const TOOLTIP_ASSET_H = 146;
const TOOLTIP_TIP_X = 147;

const TOOLTIP_W = scaleWidth(260);
const TOOLTIP_H = scaleWidth((260 * TOOLTIP_ASSET_H) / TOOLTIP_ASSET_W);

/**
 * useTooltip
 * - SVG 성공 방식: measureLayout로 "부모 기준(iconCenterX)" 실측
 * - PNG 방식: tipOffsetX(TOOLTIP_TIP_X)로 tooltipLeft 역산
 * - clamp 기준: xpLeft가 아니라 xpCard(전체 카드) width 기준
 */
function useTooltip(autoHideMs: number) {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // xpCard 너비(전체 카드 기준 clamp)
  const [cardWidth, setCardWidth] = useState(0);

  // xpCard 기준 아이콘 중앙 x
  const [iconCenterX, setIconCenterX] = useState(0);

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

  const close = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  /**
   * toggle
   * - 기준을 xpLeft가 아니라 xpCard로 잡는다 (핵심)
   */
  const toggle = useCallback(
    (cardRef: React.RefObject<View>, iconRef: React.RefObject<View>) => {
      if (visible) {
        close();
        return;
      }

      const cardNode = cardRef.current ? findNodeHandle(cardRef.current) : null;
      if (!cardNode || !iconRef.current?.measureLayout) {
        setIconCenterX(0);
        openWithAutoHide();
        return;
      }

      iconRef.current.measureLayout(
        cardNode,
        (x, _y, w) => {
          setIconCenterX(x + w / 2);
          openWithAutoHide();
        },
        () => {
          setIconCenterX(0);
          openWithAutoHide();
        },
      );
    },
    [visible, close, openWithAutoHide],
  );

  /**
   * tooltipLeft
   * - PNG 꼬리(tip) 오프셋을 이용해 tooltip의 left를 역산
   * - clamp는 xpCard 기준으로 수행 (오른쪽 XP 이미지 영역 포함)
   */
  const tooltipLeft = useMemo(() => {
    if (!cardWidth) return 0;

    const tipOffsetX = (TOOLTIP_W * TOOLTIP_TIP_X) / TOOLTIP_ASSET_W;
    const raw = iconCenterX - tipOffsetX;

    return clamp(raw, 0, cardWidth - TOOLTIP_W);
  }, [cardWidth, iconCenterX]);

  const onLayoutCard = (e: LayoutChangeEvent) =>
    setCardWidth(e.nativeEvent.layout.width);

  return {
    visible,
    toggle,
    tooltipLeft,
    onLayoutCard,
  };
}

function XpSummaryCard({
  currentXp,
  needXp,
}: {
  currentXp: number;
  needXp: number;
}) {
  const tooltip = useTooltip(1500);

  // 기준 ref: xpCard(전체 카드) + info 아이콘 wrapper
  const cardRef = useRef<View>(null);
  const iconRef = useRef<View>(null);

  return (
    <View ref={cardRef} style={styles.xpCard} onLayout={tooltip.onLayoutCard}>
      {/* 좌측 영역 */}
      <View style={styles.xpLeft}>
        <Text style={styles.xpQ}>현재 나의 경험치는?</Text>

        <Pressable
          onPress={() => tooltip.toggle(cardRef, iconRef)}
          style={styles.xpValueRow}
        >
          <Text style={styles.xpNumber}>{currentXp}</Text>
          <Text style={styles.xpUnit}> XP</Text>

          {/* measureLayout 대상: 이 wrapper */}
          <View ref={iconRef} style={styles.xpInfoIcon}>
            <InfoIcon
              width={scaleWidth(22)}
              height={scaleWidth(22)}
              color={COLORS.gray400}
            />
          </View>
        </Pressable>

        <Text style={styles.xpHint}>
          다음 단계 달성을 위해서는{'\n'}
          <Text style={styles.xpHintStrong}>{needXp}XP</Text>가 더 필요해요
        </Text>
      </View>

      {/* 우측 XP 아이콘 */}
      <View style={styles.xpImg}>
        <Image source={XpIcon} style={styles.xpImgIcon} resizeMode="contain" />
      </View>

      {/* 툴팁은 xpLeft가 아니라 xpCard 위에 absolute로 올림 (스타일/PNG 그대로) */}
      {tooltip.visible && (
        <View
          style={[
            styles.tooltipWrap,
            {
              left: tooltip.tooltipLeft,
              width: TOOLTIP_W,
              height: TOOLTIP_H,

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
    </View>
  );
}

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

    // 툴팁 absolute 기준을 "카드 전체"로 잡기 위해 필요
    position: 'relative',
  },

  xpLeft: {
    flex: 1,
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

  // PNG 버전 스타일 유지 + 그림자 제거(elevation만)
  tooltipWrap: {
    position: 'absolute',
    top: scaleWidth(88),
    zIndex: 10,
    elevation: 0,
  },

  tooltipPng: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },

  tooltipTextOverlay: {
    position: 'absolute',
    left: scaleWidth(20),
    top: scaleWidth(26),
    ...Caption_14R,
    color: COLORS.white,
    lineHeight: scaleWidth(20),
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

  xpImgIcon: {
    width: scaleWidth(92),
    height: scaleWidth(92),
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
});
