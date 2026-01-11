import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { NewsItems } from '../../../data/mock/searchData';
import {
  Body_16M,
  BORDER_RADIUS,
  Caption_14R,
  COLORS,
  scaleWidth,
} from '../../../styles/global';

type Props = {
  /** 표시할 뉴스 데이터 */
  item: NewsItems;

  /** 카드 클릭 시 호출되는 이벤트 (선택 사항) */
  onPress?: () => void;
};

/**
 * SearchResultItem
 * - 제목: 2줄
 * - 메타: [시간 아이콘] n분 | [뷰 아이콘] 200
 * - 아이콘은 자리(View)만 마련 (추후 SVG 삽입)
 * - 기존 카드/썸네일 크기, 패딩 유지
 */
export default function SearchResultItem({ item, onPress }: Props) {
  const [imgError, setImgError] = useState(false);

  const shouldShowImage = useMemo(() => {
    return !!item.imageUrl && item.imageUrl.trim().length > 0 && !imgError;
  }, [item.imageUrl, imgError]);

  // readTime이 "5분 소요" 형태면 "5분"으로 정리해서 표시
  const readTimeText = useMemo(() => {
    const raw = item.readTime ?? '';
    const match = raw.match(/(\d+)\s*분/);
    return match ? `${match[1]}분` : raw;
  }, [item.readTime]);

  // 조회수는 타입에 없을 수 있어서 우선 placeholder로 처리
  // (나중에 item.views 같은 값이 생기면 여기만 바꾸면 됨)
  const viewText = useMemo(() => {
    // @ts-ignore
    const views = item.views;
    return views === undefined || views === null ? '200' : String(views);
  }, [item]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* 좌측 텍스트 영역 */}
      <View style={styles.left}>
        {/* 뉴스 제목 (2줄 제한) */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* 메타: 시간 아이콘 n분 | 뷰 아이콘 200 */}
        <View style={styles.metaRow}>
          {/* 시간 아이콘 자리 */}
          <View style={styles.iconBox} />
          <Text style={styles.metaText}>{readTimeText}</Text>

          <Text style={styles.metaDivider}> | </Text>

          {/* 뷰 아이콘 자리 */}
          <View style={styles.iconBox} />
          <Text style={styles.metaText}>{viewText}</Text>
        </View>
      </View>

      {/* 우측 썸네일 영역 */}
      <View style={styles.thumb}>
        {shouldShowImage ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.thumbImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const THUMB_SIZE = scaleWidth(85);
const THUMB_RADIUS = BORDER_RADIUS[16];
const ICON_SIZE = scaleWidth(14);

const styles = StyleSheet.create({
  /** 카드 전체 컨테이너 (기존 유지) */
  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },

  /** 텍스트 영역 (기존 유지) */
  left: {
    flex: 1,
  },

  /** 뉴스 제목: 2줄로 변경 */
  title: {
    ...Body_16M,
    color: COLORS.black,
    paddingRight: scaleWidth(20), // 기존 유지
  },

  /** 메타 줄 (기존 meta를 row로 변경) */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleWidth(8), // 기존 meta marginTop 유지
  },

  /** 아이콘 자리 */
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: scaleWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** 메타 텍스트 (기존 meta 스타일 기반) */
  metaText: {
    ...Caption_14R,
    color: COLORS.gray700,
  },

  /** 구분자 */
  metaDivider: {
    ...Caption_14R,
    color: COLORS.gray700,
    marginHorizontal: scaleWidth(4),
  },

  /** 썸네일 컨테이너 (기존 유지) */
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.gray300, // 이미지 여백/투명 대비용 (원치 않으면 제거 가능)
  },

  /** 실제 이미지 (기존 유지) */
  thumbImage: {
    width: '100%',
    height: '100%',
  },

  /** 이미지 없을 때 회색 placeholder (기존 유지) */
  thumbPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.gray300,
  },
});
