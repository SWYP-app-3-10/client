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
 * - 리스트는 "날짜별 합산"으로 1일 = 1아이템만 노출 (기존 유지)
 * - 바텀시트는 "트랜잭션 기준"으로 묶인 상세 항목만 표시 (UI/스타일은 기존 그대로)
 */
const PointHistoryScreen = () => {
  /** 바텀시트 상태 */
  const [sheetVisible, setSheetVisible] = useState(false);

  // ✅ 변경: 선택 기준을 날짜(dayKey) -> transactionId 로 바꿈
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const openSheet = (txId: string) => {
    setSelectedTxId(txId);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setSelectedTxId(null);
  };

  /** ISO → "12월 08일" */
  const toShortDate = useCallback((iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}월 ${dd}일`;
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

  /**
   * ✅ 추가: 트랜잭션별 합산 리스트(FlatList용)
   * - 기존 DaySummaryItem과 동일한 역할인데 id/dayKey만 tx 기준으로 바뀜
   * - createdAt은 "트랜잭션 내 최신 시간"을 대표로 사용(기존 최신순 표기 유지)
   */
  type TxSummaryItem = {
    id: string; // transactionId
    transactionId: string;
    createdAt: string; // 대표 ISO (트랜잭션 내 최신)
    xpSum: number;
    ptSum: number;
  };

  const earnedList: TxSummaryItem[] = useMemo(() => {
    const map = new Map<
      string,
      { xpSum: number; ptSum: number; latestIso: string }
    >();

    for (const it of earnedRawList) {
      const key = it.transactionId; // ✅ 트랜잭션 기준
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

    const list: TxSummaryItem[] = Array.from(map.entries()).map(([key, v]) => ({
      id: key,
      transactionId: key,
      createdAt: v.latestIso,
      xpSum: v.xpSum,
      ptSum: v.ptSum,
    }));

    // 최신 트랜잭션이 위로 (대표 latestIso 기준)
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return list;
  }, [earnedRawList]);

  /**
   * ✅ 변경: 선택한 트랜잭션의 상세(원본 항목들)
   * - 기존 bundledItems = dayKey 필터였는데
   * - 이제 bundledItems = transactionId 필터
   */
  const bundledItems = useMemo(() => {
    if (!selectedTxId) return [];
    return earnedRawList.filter(it => it.transactionId === selectedTxId);
  }, [selectedTxId, earnedRawList]);

  /** 리스트 아이템(기존 UI/스타일 그대로) */
  const renderItem = ({ item }: { item: TxSummaryItem }) => {
    const hasXp = item.xpSum > 0;
    const hasPt = item.ptSum > 0;

    return (
      <Pressable
        style={styles.rowPressable}
        onPress={() => openSheet(item.transactionId)} // ✅ 트랜잭션 id로 오픈
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

            {/* ✅ 날짜 표시는 기존대로 유지: 대표 createdAt을 mm월 dd일로 */}
            <Text style={styles.shortDate}>{toShortDate(item.createdAt)}</Text>
          </View>

          {/* 2줄: 자세히 보기 */}
          <Text style={styles.detailHint}>자세히 보기</Text>
        </View>
      </Pressable>
    );
  };

  /** ✅ 바텀시트 내부 항목(기존 UI/스타일 그대로) */
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

  /** 바텀시트 콘텐츠: 기존처럼 "상세 리스트만" */
  const SheetContent = () => {
    if (!selectedTxId) return null;

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
