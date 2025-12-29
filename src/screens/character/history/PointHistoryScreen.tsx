import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  pointHistoryMock,
  PointHistoryItem,
} from '../../../data/mock/characterData';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomSheetModal from '../../../components/BottomSheetModal';
import { Caption_14R, COLORS, Heading_18SB } from '../../../styles/global';

/**
 * PointHistoryScreen
 *
 * - "받은 내역"만 보여주는 화면
 * - 리스트 시안(1번) 형태:
 *   1) 첫 줄: 아이콘 + XP/P, 우측 날짜
 *   2) 둘째 줄: "자세히 보기"
 * - 아이템 클릭 시 바텀시트 노출
 */
const PointHistoryScreen = () => {
  const navigation = useNavigation<any>();

  /** 바텀시트 상태 */
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PointHistoryItem | null>(
    null,
  );

  const openSheet = (item: PointHistoryItem) => {
    setSelectedItem(item);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setSelectedItem(null);
  };

  /** 받은 내역만 필터링 (획득만) */
  const earnedList = useMemo(() => {
    return pointHistoryMock.filter(it => it.xpDelta > 0 || it.ptDelta > 0);
  }, []);

  /** 미션 달성 여부 (XP + P 모두 받은 경우) */
  const isMissionEarned = (item: PointHistoryItem) =>
    item.xpDelta > 0 && item.ptDelta > 0;

  /** 바텀시트 상세 정보 (화면단 구성) */
  const getDetailRows = (item: PointHistoryItem) => {
    if (!isMissionEarned(item)) return [];

    return [
      { label: '적립 유형', value: '미션 달성' },
      { label: '보상', value: `${item.xpDelta} XP / ${item.ptDelta} P` },
      { label: '지급일', value: item.createdAt },
    ];
  };

  /** "2025년 12월 08일" -> "12월 08일" */
  const toShortDate = (createdAt: string) => {
    const match = createdAt.match(/(\d{1,2})월\s*(\d{1,2})일/);
    if (!match) return createdAt;
    const mm = match[1].padStart(2, '0');
    const dd = match[2].padStart(2, '0');
    return `${mm}월 ${dd}일`;
  };

  /** 리스트 아이템 (✅ 1번 시안 레이아웃) */
  const renderItem = ({ item }: { item: PointHistoryItem }) => {
    const hasXp = item.xpDelta > 0;
    const hasPt = item.ptDelta > 0;

    return (
      <Pressable style={styles.rowPressable} onPress={() => openSheet(item)}>
        <View style={styles.row}>
          {/* 1줄: 아이콘 + XP/P  |  우측 날짜 */}
          <View style={styles.line1}>
            <View style={styles.leftGroup}>
              <View style={styles.icon} />

              <View style={styles.badgeLine}>
                {hasXp && (
                  <Text style={[styles.badgeText, styles.badgeXp]}>
                    {item.xpDelta} XP
                  </Text>
                )}
                {hasPt && (
                  <Text style={[styles.badgeText, styles.badgePt]}>
                    {item.ptDelta} P
                  </Text>
                )}
              </View>
            </View>

            <Text style={styles.shortDate}>{toShortDate(item.createdAt)}</Text>
          </View>

          {/* 2줄: 자세히 보기 (아이콘 자리만큼 들여쓰기) */}
          <Text style={styles.detailHint}>자세히 보기</Text>
        </View>
      </Pressable>
    );
  };

  /** 바텀시트 콘텐츠 */
  const SheetContent = () => {
    if (!selectedItem) return null;

    const detailRows = getDetailRows(selectedItem);

    return (
      <View style={styles.sheetContainer}>
        {/* 요약 */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetBadgeLine}>
            {selectedItem.xpDelta > 0 && (
              <Text style={[styles.sheetBadgeText, styles.badgeXp]}>
                {selectedItem.xpDelta} XP
              </Text>
            )}
            {selectedItem.ptDelta > 0 && (
              <Text style={[styles.sheetBadgeText, styles.badgePt]}>
                {selectedItem.ptDelta} P
              </Text>
            )}
          </View>

          <Text style={styles.sheetTitle} numberOfLines={2}>
            {selectedItem.title}
          </Text>

          <Text style={styles.sheetDate}>{selectedItem.createdAt}</Text>
        </View>

        {/* 상세 */}
        {detailRows.length > 0 && (
          <View style={styles.sheetList}>
            {detailRows.map((row, idx) => (
              <View
                key={`${row.label}-${idx}`}
                style={[
                  styles.sheetRow,
                  idx !== detailRows.length - 1 && styles.sheetRowBorder,
                ]}
              >
                <Text style={styles.sheetRowLabel}>{row.label}</Text>
                <Text style={styles.sheetRowValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>받은 내역 확인하기</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* 리스트 */}
      <FlatList
        data={earnedList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* 바텀시트 */}
      <BottomSheetModal visible={sheetVisible} onClose={closeSheet}>
        <SheetContent />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default PointHistoryScreen;

const ICON_SIZE = 26;
const ICON_GAP = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* 헤더 */
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  back: { fontSize: 20 },
  headerTitle: { fontSize: 16, fontWeight: '700' },

  /* 리스트 */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray200,
  },

  rowPressable: {
    borderRadius: 12,
  },

  /* 아이템 */
  row: {
    paddingVertical: 24, // 시안처럼 좀 더 컴팩트
    gap: 12,
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
    borderRadius: 4,
    backgroundColor: COLORS.gray200,
    marginRight: ICON_GAP,
  },

  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  badgeText: {
    ...Heading_18SB,
  },

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

  /* 바텀시트 */
  sheetContainer: { paddingBottom: 16 },
  sheetHeader: { paddingBottom: 16 },

  sheetBadgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetBadgeText: {
    fontSize: 16,
    fontWeight: '900',
  },
  sheetTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  sheetDate: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#98A2B3',
  },

  sheetList: {
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    paddingTop: 12,
  },
  sheetRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  sheetRowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  sheetRowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#98A2B3',
  },
});
