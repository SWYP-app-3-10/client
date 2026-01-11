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
 *
 * - 검색 결과로 노출되는 단일 뉴스 카드 컴포넌트
 * - 제목 / 부제목 / 읽기 시간 정보 표시
 * - 카드 전체를 터치 영역으로 사용
 */
export default function SearchResultItem({ item, onPress }: Props) {
  const [imgError, setImgError] = useState(false);

  // imageUrl이 비어있거나 에러난 경우엔 placeholder를 보여줌
  const shouldShowImage = useMemo(() => {
    return !!item.imageUrl && item.imageUrl.trim().length > 0 && !imgError;
  }, [item.imageUrl, imgError]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* 좌측 텍스트 영역 */}
      <View style={styles.left}>
        {/* 뉴스 제목 (1줄 제한) */}
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        {/* 뉴스 부제목 (2줄 제한) */}
        <Text style={styles.sub} numberOfLines={2}>
          {item.subtitle}
        </Text>

        {/* 읽기 시간 / 메타 정보 */}
        <Text style={styles.meta}>{item.readTime}</Text>
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

const styles = StyleSheet.create({
  /** 카드 전체 컨테이너 */
  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },

  /** 텍스트 영역 */
  left: {
    flex: 1,
  },

  /** 뉴스 제목 */
  title: {
    ...Body_16M,
    color: COLORS.black,
    paddingRight: scaleWidth(20),
  },

  /** 뉴스 부제목 */
  sub: {
    ...Body_16M,
    color: COLORS.black,
  },

  /** 읽기 시간 등 메타 정보 */
  meta: {
    ...Caption_14R,
    color: COLORS.gray700,
    marginTop: scaleWidth(8),
  },

  /** 썸네일 컨테이너 */
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_RADIUS,
    overflow: 'hidden', // radius 적용되게
  },

  /** 실제 이미지 */
  thumbImage: {
    width: '100%',
    height: '100%',
  },

  /** 이미지 없을 때 회색 placeholder */
  thumbPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.gray300,
  },
});
