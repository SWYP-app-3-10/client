import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import {
  pointHistoryMock,
  PointHistoryItem,
} from '../../../data/mock/characterData';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomSheetModal from '../../../components/BottomSheetModal';
import {
  Caption_14R,
  COLORS,
  Heading_18SB,
  scaleWidth,
  BORDER_RADIUS,
  Body_16M,
} from '../../../styles/global';
import Header from '../../../components/Header';

/**
 * PointHistoryScreen
 *
 * - 리스트는 "날짜별 합산"으로 1일 = 1아이템만 노출
 *   예) 12/04에 2개가 있으면 → 80XP 70P, 12월 04일 (1개만 표시)
 * - 레이아웃/스타일은 기존 유지
 * - 바텀시트는 해당 날짜의 상세 항목 리스트만 표시 (상단 합산 요약 제거)
 */
const PointHistoryScreen = () => {
  /** 바텀시트 상태 */
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const openSheet = (day: string) => {
    setSelectedDayKey(day);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setSelectedDayKey(null);
  };

  /** ISO → "12월 08일" */
  const toShortDate = useCallback((iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}월 ${dd}일`;
  }, []);

  /** ISO에서 날짜 키(yyyy-mm-dd)만 뽑기 */
  const dayKey = useCallback((iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  /** 받은 내역만 필터링 + 최신순 정렬(원본) */
  const earnedRawList = useMemo(() => {
    return pointHistoryMock
      .filter(it => it.xpDelta > 0 || it.ptDelta > 0)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, []);

  /** 날짜별 합산 리스트(FlatList용) */
  type DaySummaryItem = {
    id: string; // dayKey
    dayKey: string;
    createdAt: string; // 날짜 표시용 대표 ISO
    xpSum: number;
    ptSum: number;
  };

  const earnedList: DaySummaryItem[] = useMemo(() => {
    const map = new Map<
      string,
      { xpSum: number; ptSum: number; latestIso: string }
    >();

    for (const it of earnedRawList) {
      const key = dayKey(it.createdAt);
      const xp = Math.max(0, it.xpDelta);
      const pt = Math.max(0, it.ptDelta);

      const prev = map.get(key);
      if (!prev) {
        map.set(key, { xpSum: xp, ptSum: pt, latestIso: it.createdAt });
        continue;
      }

      prev.xpSum += xp;
      prev.ptSum += pt;

      if (
        new Date(it.createdAt).getTime() > new Date(prev.latestIso).getTime()
      ) {
        prev.latestIso = it.createdAt;
      }
    }

    const list: DaySummaryItem[] = Array.from(map.entries()).map(
      ([key, v]) => ({
        id: key,
        dayKey: key,
        createdAt: v.latestIso,
        xpSum: v.xpSum,
        ptSum: v.ptSum,
      }),
    );

    // 최신 날짜가 위로
    list.sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1));

    return list;
  }, [earnedRawList, dayKey]);

  /** 선택한 날짜의 상세(원본 항목들) */
  const bundledItems = useMemo(() => {
    if (!selectedDayKey) return [];
    return earnedRawList.filter(it => dayKey(it.createdAt) === selectedDayKey);
  }, [selectedDayKey, earnedRawList, dayKey]);

  /** 리스트 아이템(날짜 합산 1일 1아이템 / 레이아웃 유지) */
  const renderItem = ({ item }: { item: DaySummaryItem }) => {
    const hasXp = item.xpSum > 0;
    const hasPt = item.ptSum > 0;

    return (
      <Pressable
        style={styles.rowPressable}
        onPress={() => openSheet(item.dayKey)}
      >
        <View style={styles.row}>
          {/* 1줄: 아이콘 + XP/P  |  우측 날짜 */}
          <View style={styles.line1}>
            <View style={styles.leftGroup}>
              <View style={styles.icon} />

              <View style={styles.badgeLine}>
                {hasXp && (
                  <Text style={[styles.badgeText, styles.badgeXp]}>
                    {item.xpSum} XP
                  </Text>
                )}
                {hasPt && (
                  <Text style={[styles.badgeText, styles.badgePt]}>
                    {item.ptSum} P
                  </Text>
                )}
              </View>
            </View>

            <Text style={styles.shortDate}>{toShortDate(item.createdAt)}</Text>
          </View>

          {/* 2줄: 자세히 보기 */}
          <Text style={styles.detailHint}>자세히 보기</Text>
        </View>
      </Pressable>
    );
  };

  /** 바텀시트 내부 항목(해당 날짜 상세) */
  const renderSheetItem = ({ item }: { item: PointHistoryItem }) => {
    const hasXp = item.xpDelta > 0;
    const hasPt = item.ptDelta > 0;

    return (
      <View style={styles.sheetItem}>
        <View style={styles.sheetItemTop}>
          <View style={styles.sheetBadgeLine}>
            {hasXp && (
              <Text style={[styles.sheetBadgeText, styles.badgeXp]}>
                {item.xpDelta} XP
              </Text>
            )}
            {hasPt && (
              <Text style={[styles.sheetBadgeText, styles.badgePt]}>
                {item.ptDelta} P
              </Text>
            )}
          </View>

          <Text style={styles.sheetRightDate}>
            {toShortDate(item.createdAt)}
          </Text>
        </View>

        <Text style={styles.sheetItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  /** 바텀시트 콘텐츠: ✅ 상단 합산 요약 제거, 상세 리스트만 */
  const SheetContent = () => {
    if (!selectedDayKey) return null;

    return (
      <View style={styles.sheetContainer}>
        <FlatList
          data={bundledItems}
          keyExtractor={it => it.id}
          renderItem={renderSheetItem}
          ItemSeparatorComponent={() => <View style={styles.sheetSeparator} />}
          contentContainerStyle={styles.sheetListContent}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="받은 내역 확인하기" />

      <FlatList
        data={earnedList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <BottomSheetModal visible={sheetVisible} onClose={closeSheet}>
        <SheetContent />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default PointHistoryScreen;

const ICON_SIZE = scaleWidth(26);
const ICON_GAP = scaleWidth(10);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  /* ================= 리스트 ================= */
  listContent: {
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleWidth(48),
  },
  separator: {
    height: scaleWidth(1),
    backgroundColor: COLORS.gray200,
  },
  rowPressable: {
    borderRadius: BORDER_RADIUS[12],
  },

  /* 아이템 */
  row: {
    paddingVertical: scaleWidth(24),
    gap: scaleWidth(12),
  },
  line1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ICON_SIZE,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: BORDER_RADIUS[4],
    backgroundColor: COLORS.gray200,
    marginRight: ICON_GAP,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(12),
  },
  badgeText: {
    ...Heading_18SB,
  },
  // 시안 컬러: XP(블루), P(옐로)
  badgeXp: { color: COLORS.blue[6] },
  badgePt: { color: COLORS.yellow.main },

  shortDate: {
    ...Caption_14R,
    color: COLORS.gray600,
  },
  detailHint: {
    ...Caption_14R,
    color: COLORS.gray800,
  },

  /* ================= 바텀시트 ================= */
  sheetContainer: {
    paddingBottom: scaleWidth(12),
  },
  sheetListContent: {
    paddingBottom: scaleWidth(48),
  },
  sheetSeparator: {
    height: scaleWidth(1),
    backgroundColor: COLORS.gray200,
  },
  sheetItem: {
    paddingVertical: scaleWidth(18),
  },
  sheetItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetBadgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(12),
  },
  sheetBadgeText: {
    ...Heading_18SB,
  },
  sheetRightDate: {
    ...Caption_14R,
    color: COLORS.gray600,
  },
  sheetItemTitle: {
    marginTop: scaleWidth(10),
    ...Body_16M,
    color: COLORS.black,
  },
});
