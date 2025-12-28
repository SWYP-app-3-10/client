import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { FullScreenStackParamList } from '../../navigation/types';
import { RouteNames } from '../../../routes';

import RecentSearches from '../../components/RecentSearches';
import SearchHeader from './components/SearchHeader';
import { COLORS, scaleWidth } from '../../styles/global';
import {
  loadRecents,
  addRecent,
  removeRecent,
} from '../../storage/recentSearches';

type Props = NativeStackScreenProps<
  FullScreenStackParamList,
  typeof RouteNames.SEARCH_INPUT
>;

type SearchRecord = {
  searchName: string;
};

export default function SearchInputScreen({ navigation }: Props) {
  /** 현재 입력 중인 검색어 */
  const [text, setText] = useState('');
  /** 최근 검색어 목록 */
  const [searchRecord, setSearchRecord] = useState<SearchRecord[]>([]);

  // string[] -> SearchRecord[] 변환
  const convertToSearchRecords = (keywords: string[]): SearchRecord[] =>
    keywords.map(keyword => ({ searchName: keyword }));

  // 마운트 시 최근 검색어 로드
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const keywords = await loadRecents();
        setSearchRecord(convertToSearchRecords(keywords));
      } catch (error) {
        console.error('최근 검색어 불러오기 실패:', error);
      }
    };
    loadRecentSearches();
  }, []);

  // ✅ 검색어 저장 (useCallback)
  const recordSearch = useCallback(async (keyword: string) => {
    try {
      const updated = await addRecent(keyword);
      setSearchRecord(convertToSearchRecords(updated));
    } catch (error) {
      console.error('검색어 저장 실패:', error);
    }
  }, []);

  // ✅ 검색 실행 (useCallback)
  const submit = useCallback(
    async (kw?: string) => {
      const keyword = (kw ?? text).trim();
      if (!keyword) return;

      await recordSearch(keyword);

      // ✅ 검색 결과 화면(탭바 없음)으로 이동
      navigation.navigate(RouteNames.SEARCH_RESULT, { keyword });
    },
    [text, recordSearch, navigation],
  );

  // 최근 검색어 클릭
  const handleRecentSearchClick = useCallback(
    async (keyword: string) => {
      setText(keyword);
      await submit(keyword); // ✅ 저장 + SEARCH_RESULT 이동까지 한 번에
    },
    [submit],
  );

  // 최근 검색어 삭제
  const removeSearchRecordFn = useCallback(async (name: string) => {
    try {
      const updated = await removeRecent(name);
      setSearchRecord(convertToSearchRecords(updated));
    } catch (error) {
      console.error('검색어 삭제 실패:', error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ✅ 검색 전용 헤더 사용 */}
      <SearchHeader
        value={text}
        onChangeText={setText}
        onSubmit={() => submit()}
        goBackAction={() => navigation.goBack()}
        // iconColor={COLORS.black} // 필요하면
      />

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>최근 검색어</Text>

        <View style={styles.chipsArea}>
          {searchRecord.length === 0 ? (
            <Text style={styles.emptyText}>최근 검색어가 없습니다.</Text>
          ) : (
            <View style={styles.recentContainer}>
              {searchRecord.map((value, index) => (
                <RecentSearches
                  key={index.toString()}
                  index={index}
                  removeSearchRecord={removeSearchRecordFn}
                  recordSearch={handleRecentSearchClick} // ✅ 누르면 결과로 이동
                  setSearch={setText}
                  item={value}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =========================
  스타일
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  sectionTitle: {
    marginTop: scaleWidth(12),
    marginBottom: scaleWidth(10),
    fontSize: scaleWidth(14),
    fontWeight: '600',
    color: COLORS.gray700,
  },
  chipsArea: {
    flex: 1,
  },
  emptyText: {
    fontSize: scaleWidth(13),
    color: COLORS.gray400,
    marginTop: scaleWidth(6),
  },
  recentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleWidth(10),
  },
});
