import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import SearchResultItem from './components/SearchResultItem';
import { NewsItems } from '../../data/mock/searchData';
import { COLORS, scaleWidth } from '../../styles/global';
import { useSearchContents } from '../../hooks/useSearchContents';

type Props = {
  // 현재 입력 중인 검색어
  keyword: string;

  // 검색 결과 아이템 클릭 시 실행할 핸들러
  // (SearchInputScreen에서 기사 이동 / 검색어 저장 등을 처리)
  onPressItem: (item: NewsItems) => void;
};

export default function SearchLiveResultOverlay({
  keyword,
  onPressItem,
}: Props) {
  // 실제 API 호출 (keyword가 있을 때만 작동하도록 enabled 처리)
  const { data, isLoading } = useSearchContents({
    keyword: keyword.trim(),
    enabled: keyword.trim().length > 0,
  });

  // 서버 응답 데이터를 NewsItems 형식으로 변환
  const liveResults: NewsItems[] = (
    data?.pages.flatMap(page => page) ?? []
  ).map(item => ({
    id: String(item.contentId),
    category: item.categoryName as any,
    title: item.title,
    subtitle: '',
    readTime: `${item.readingTime}분 소요`,
    content: '',
  }));

  // 검색어가 비어 있으면 오버레이 자체를 렌더링하지 않음
  // (X 버튼으로 입력 삭제 시 자동으로 사라지게 하기 위함)
  if (!keyword.trim()) return null;

  return (
    // absoluteFillObject를 사용해
    // SearchInputScreen의 기존 UI 위를 "덮는" 오버레이 레이어
    <View style={styles.overlay} pointerEvents="auto">
      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color={COLORS.puple.main}
        />
      ) : (
        <FlatList
          data={liveResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SearchResultItem item={item} onPress={() => onPressItem(item)} />
          )}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
  },
  listContent: {
    paddingTop: scaleWidth(12),
    paddingBottom: scaleWidth(24),
    gap: scaleWidth(12),
  },
  emptyText: {
    fontSize: scaleWidth(13),
    color: COLORS.gray400,
    marginTop: scaleWidth(20),
    textAlign: 'center',
  },
});
