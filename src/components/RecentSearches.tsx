import React from 'react';
import { Text, View } from 'react-native';

import Button from './Button';
import IconButton from './IconButton';
import Spacer from './Spacer';
import { CloseIcon } from '../icons';

import { scaleWidth, BORDER_RADIUS, COLORS } from '../styles/global';

type Props = {
  index: number;
  item: { searchName: string };

  // 검색어 클릭 시
  setSearch: (text: string) => void;
  recordSearch: (keyword: string) => void;

  // X 버튼 클릭 시
  removeSearchRecord: (name: string) => void;

  // 옵션
  maxWidth?: number;
  minWidth?: number;
  closeIconColor?: string;
};

/**
 * RecentSearch
 *
 * - 최근 검색어 칩 버튼 컴포넌트
 * - 검색어 클릭: 검색 실행
 * - X 클릭: 해당 검색어 삭제
 */
const RecentSearch = ({
  index,
  item,
  setSearch,
  recordSearch,
  removeSearchRecord,
  maxWidth,
  minWidth,
  closeIconColor,
}: Props) => {
  return (
    <Button
      key={index.toString()}
      onPress={() => {
        // ✅ 검색어 클릭 → 입력값 반영 + 검색 실행
        setSearch(item.searchName);
        recordSearch(item.searchName);
      }}
      style={{
        borderRadius: BORDER_RADIUS[30],
        width: 'auto',
        minWidth: minWidth ?? undefined,
        maxWidth: maxWidth ?? scaleWidth(133),
        paddingHorizontal: scaleWidth(12),
        height: scaleWidth(40),
        backgroundColor: COLORS.gray100,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <>
        {/* 검색어 텍스트 */}
        <View style={{ flexShrink: 1 }}>
          <Text style={{ color: COLORS.gray800 }} numberOfLines={1}>
            {item.searchName}
          </Text>
        </View>

        <Spacer horizontal num={5} />

        {/* 삭제 버튼 */}
        <IconButton onPress={() => removeSearchRecord(item.searchName)}>
          <CloseIcon color={closeIconColor ?? COLORS.gray500} />
        </IconButton>
      </>
    </Button>
  );
};

export default RecentSearch;
