import React, { useEffect, useState } from 'react';
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
import { COLORS, scaleWidth } from '../../styles/global';
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
 * - 검색어 입력 화면 (이미지 1)
 * - 최근 검색어를 AsyncStorage에 저장 / 삭제
 * - 검색 실행 시 SearchScreen으로 keyword 전달
 */
export default function SearchInputScreen({ navigation }: Props) {
  /** 현재 입력 중인 검색어 */
  const [text, setText] = useState('');
  /** 최근 검색어 목록 */
  const [searchRecord, setSearchRecord] = useState<SearchRecord[]>([]);

  // string[] -> SearchRecord[] 변환
  const convertToSearchRecords = (keywords: string[]): SearchRecord[] => {
    return keywords.map(keyword => ({ searchName: keyword }));
  };

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

  // 검색어 저장 (중복 제거, 최신순)
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
    if (!keyword) return;

    // 최근 검색어 저장
    await recordSearch(keyword);

    // 검색 결과 화면으로 이동
    navigation.navigate(RouteNames.SEARCH, { keyword });
  };

  // 최근 검색어 클릭 -> 검색 실행
  const handleRecentSearchClick = async (keyword: string) => {
    setText(keyword);
    await recordSearch(keyword);
    navigation.navigate(RouteNames.SEARCH, { keyword });
  };

  // 최근 검색어 한 개 삭제
  const removeSearchRecord = async (name: string) => {
    try {
      const updated = await removeRecent(name);
      setSearchRecord(convertToSearchRecords(updated));
    } catch (error) {
      console.error('검색어 삭제 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* ===== 상단: 뒤로가기 + 검색바 (이미지 1) ===== */}
        <View style={styles.topRow}>
          {/* 뒤로가기 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {/* 검색 입력창 (연한 회색 캡슐) */}
          <View style={styles.searchBarWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="글을 검색해보세요"
              placeholderTextColor={COLORS.gray400}
              returnKeyType="search"
              onSubmitEditing={() => submit()}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* ===== 최근 검색어 ===== */}
        <Text style={styles.sectionTitle}>최근 검색어</Text>

        {/* 칩 리스트 */}
        <View style={styles.chipsArea}>
          {searchRecord.length === 0 ? (
            <Text style={styles.emptyText}>최근 검색어가 없습니다.</Text>
          ) : (
            <View style={styles.recentContainer}>
              {searchRecord.map((value, index) => (
                <RecentSearches
                  key={index.toString()}
                  index={index}
                  removeSearchRecord={removeSearchRecord}
                  recordSearch={handleRecentSearchClick}
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
   스타일 (자세한 주석)
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1, // 화면 전체 높이 채움
    backgroundColor: COLORS.white, // 전체 배경 흰색
  },

  container: {
    flex: 1, // 내부 영역 채움
    paddingHorizontal: scaleWidth(20), // 좌우 여백(시안처럼 넉넉하게)
  },

  topRow: {
    flexDirection: 'row', // 뒤로 + 검색바를 가로로 배치
    alignItems: 'center', // 수직 중앙 정렬
    height: scaleWidth(52), // 상단 영역 높이(이미지 1 느낌)
  },

  backBtn: {
    paddingRight: scaleWidth(10), // 뒤로 버튼과 검색바 사이 간격
    paddingVertical: scaleWidth(6), // 터치 영역 확보
  },

  backText: {
    fontSize: scaleWidth(26), // iOS 느낌의 얇은 chevron 크기
    color: COLORS.black, // 아이콘 색
    lineHeight: scaleWidth(28), // 위아래 흔들림 방지
  },

  searchBarWrap: {
    flex: 1, // 검색바가 남는 공간 전부 차지
    height: scaleWidth(40), // 검색바 높이(시안)
    borderRadius: scaleWidth(20), // 캡슐 형태
    backgroundColor: COLORS.gray100, // 연한 회색 배경
    paddingHorizontal: scaleWidth(14), // 내부 좌우 여백
    justifyContent: 'center', // 텍스트 수직 중앙
  },

  searchInput: {
    fontSize: scaleWidth(14), // 입력 글자 크기
    color: COLORS.black, // 입력 텍스트 색
    padding: 0, // RN TextInput 기본 패딩 제거(정렬 깨짐 방지)
  },

  sectionTitle: {
    marginTop: scaleWidth(12), // 검색바 아래 간격
    marginBottom: scaleWidth(10), // 타이틀 아래 간격
    fontSize: scaleWidth(14), // 섹션 타이틀 크기
    fontWeight: '600', // 살짝 굵게
    color: COLORS.gray700, // 회색 톤
  },

  chipsArea: {
    flex: 1, // 남는 공간 사용
  },

  emptyText: {
    fontSize: scaleWidth(13), // 안내 문구 크기
    color: COLORS.gray400, // 연한 회색
    marginTop: scaleWidth(6), // 살짝 띄우기
  },

  recentContainer: {
    flexDirection: 'row', // 칩을 가로로 배치
    flexWrap: 'wrap', // 화면 넘어가면 다음 줄로
    gap: scaleWidth(10), // 칩 간격(지원 안 되면 RecentSearches 내부 margin으로 대체 가능)
  },
});
