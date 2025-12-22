import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../navigation/types';
import { RouteNames } from '../../../routes';
import RecentSearches from '../../components/RecentSearches';
import { scaleWidth } from '../../styles/global';
import {
  loadRecents,
  addRecent,
  removeRecent,
} from '../../storage/recentSearches';

type Props = NativeStackScreenProps<
  SearchStackParamList,
  typeof RouteNames.SEARCH_INPUT
>;

type SearchRecord = {
  searchName: string;
};

/**
 * SearchInputScreen
 *
 * - 검색어 입력 화면
 * - 최근 검색어를 AsyncStorage에 저장 / 삭제
 * - 검색 실행 시 SearchScreen으로 keyword 전달
 */
export default function SearchInputScreen({ navigation }: Props) {
  /** 현재 입력 중인 검색어 */
  const [text, setText] = useState('');
  /** 최근 검색어 목록 */
  const [searchRecord, setSearchRecord] = useState<SearchRecord[]>([]);

  // string[]을 SearchRecord[]로 변환
  const convertToSearchRecords = (keywords: string[]): SearchRecord[] => {
    return keywords.map(keyword => ({ searchName: keyword }));
  };

  // 컴포넌트 마운트 시 AsyncStorage에서 최근 검색어 불러오기
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

  // 검색어 저장 (중복 제거, 최신순으로 정렬)
  const recordSearch = async (keyword: string) => {
    try {
      const updated = await addRecent(keyword);
      setSearchRecord(convertToSearchRecords(updated));
    } catch (error) {
      console.error('검색어 저장 실패:', error);
    }
  };

  // 검색 실행
  const submit = async (kw?: string) => {
    const keyword = (kw ?? text).trim();
    if (!keyword) {
      return;
    }

    // 검색어 저장
    await recordSearch(keyword);

    // 검색 결과 화면으로 이동
    navigation.navigate(RouteNames.SEARCH, { keyword });
  };

  // 최근 검색어 클릭 시 검색 실행
  const handleRecentSearchClick = async (keyword: string) => {
    setText(keyword);
    // 검색어 저장 및 검색 실행
    await recordSearch(keyword);
    navigation.navigate(RouteNames.SEARCH, { keyword });
  };

  // 최근검색어 하나 제거
  const removeSearchRecord = async (name: string) => {
    try {
      const updated = await removeRecent(name);
      setSearchRecord(convertToSearchRecords(updated));
    } catch (error) {
      console.error('검색어 삭제 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 상단 영역 */}
        <View style={styles.topRow}>
          {/* 뒤로가기 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {/* 검색 입력창 */}
          <View style={styles.inputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="글을 검색해보세요"
              placeholderTextColor="#A0A0A0"
              returnKeyType="search"
              onSubmitEditing={() => submit()}
              style={styles.input}
            />
          </View>
        </View>

        {/* 최근 검색어 */}
        <Text style={styles.sectionTitle}>최근 검색어</Text>

        <View style={styles.chipWrap}>
          {searchRecord.length === 0 ? (
            <Text style={styles.empty}>최근 검색어가 없습니다.</Text>
          ) : (
            <View style={styles.recentSearchesContainer}>
              {searchRecord.map((value, index) => {
                return (
                  <RecentSearches
                    key={index.toString()}
                    index={index}
                    removeSearchRecord={removeSearchRecord}
                    recordSearch={handleRecentSearchClick}
                    setSearch={setText}
                    item={value}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* 하단 버튼 */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.nextBtn,
              text.trim() === '' && styles.nextBtnDisabled,
            ]}
            disabled={text.trim() === ''}
            onPress={() => submit()}
          >
            <Text style={styles.nextText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1, paddingHorizontal: 16 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  backBtn: { paddingRight: 6, paddingVertical: 4 },
  backText: { fontSize: 24 },

  inputWrap: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
  },
  input: { fontSize: 14, padding: 0 },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },

  empty: { color: '#999' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  recentSearchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleWidth(10),
    width: scaleWidth(329),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 32,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 13, color: '#333' },
  chipX: { marginLeft: 8, paddingHorizontal: 2, paddingVertical: 2 },
  chipXText: { fontSize: 16, color: '#777' },

  bottom: { marginTop: 'auto', paddingBottom: 16 },
  nextBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DEDEDE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextText: { fontSize: 16, fontWeight: '600' },
});
