import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'; // Safe Area 추가
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RouteNames} from '../../../../routes'; // ✅ 추가
import type {SearchStackParamList} from '../../../navigation/types';

import {
  addRecent,
  loadRecents,
  removeRecent,
} from '../../../storage/recentSearches';

type Props = NativeStackScreenProps<
  SearchStackParamList,
  typeof RouteNames.SEARCH_INPUT
>;

/**
 * ✅ 검색 입력 화면
 * - 최근 검색어: AsyncStorage 저장/삭제
 * - 다음: SearchScreen(RouteNames.SEARCH)으로 keyword 전달 → SearchScreen이 필터링 결과 표시
 */
export default function SearchInputScreen({navigation}: Props) {
  const [text, setText] = useState('');
  const [recents, setRecents] = useState<string[]>([]);

  // ✅ 진입 시 최근 검색어 로드
  useEffect(() => {
    (async () => {
      const list = await loadRecents();
      setRecents(list);
    })();
  }, []);

  // ✅ 검색 실행(엔터/다음 버튼/최근검색어 클릭)
  const submit = async (kw?: string) => {
    const keyword = (kw ?? text).trim();
    if (!keyword) return;

    // ✅ 최근 검색어 저장
    const next = await addRecent(keyword);
    setRecents(next);

    // ✅ SearchScreen으로 keyword 전달 (필터링 상태로 전환)
    navigation.navigate(RouteNames.SEARCH, {keyword});
  };

  // ✅ 최근 검색어 삭제
  const onRemove = async (k: string) => {
    const next = await removeRecent(k);
    setRecents(next);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 상단: 뒤로 + 검색바 */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

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

        <Text style={styles.sectionTitle}>최근 검색어</Text>

        <View style={styles.chipWrap}>
          {recents.length === 0 ? (
            <Text style={styles.empty}>최근 검색어가 없습니다.</Text>
          ) : (
            recents.map(word => (
              <View key={word} style={styles.chip}>
                <TouchableOpacity onPress={() => submit(word)}>
                  <Text style={styles.chipText}>{word}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onRemove(word)}
                  style={styles.chipX}>
                  <Text style={styles.chipXText}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* 하단 버튼 */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.nextBtn, text.trim() === '' && {opacity: 0.4}]}
            disabled={text.trim() === ''}
            onPress={() => submit()}>
            <Text style={styles.nextText}>다음</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------
          🔥 [백엔드 연동 포인트]
          - 추천 검색어 API가 생기면 여기서 가져와서 칩 렌더링
          - 검색어 자동완성 API 연결 가능
        --------------------------------------------------------- */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: 'white'},
  container: {flex: 1, paddingHorizontal: 16},

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  backBtn: {paddingRight: 6, paddingVertical: 4},
  backText: {fontSize: 24},

  inputWrap: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
  },
  input: {fontSize: 14, padding: 0},

  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },

  empty: {color: '#999'},

  chipWrap: {flexDirection: 'row', flexWrap: 'wrap'},
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
  chipText: {fontSize: 13, color: '#333'},
  chipX: {marginLeft: 8, paddingHorizontal: 2, paddingVertical: 2},
  chipXText: {fontSize: 16, color: '#777'},

  bottom: {marginTop: 'auto', paddingBottom: 16},
  nextBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DEDEDE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {fontSize: 16, fontWeight: '600'},
});
