import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RouteNames} from '../../../../routes';
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
 * SearchInputScreen
 *
 * - 검색어 입력 화면
 * - 최근 검색어를 AsyncStorage에 저장 / 삭제
 * - 검색 실행 시 SearchScreen으로 keyword 전달
 */
export default function SearchInputScreen({navigation}: Props) {
  /** 현재 입력 중인 검색어 */
  const [text, setText] = useState('');

  /** 저장된 최근 검색어 목록 */
  const [recents, setRecents] = useState<string[]>([]);

  /**
   * 화면 진입 시
   * - AsyncStorage에 저장된 최근 검색어 로드
   */
  useEffect(() => {
    (async () => {
      const list = await loadRecents();
      setRecents(list);
    })();
  }, []);

  /**
   * 검색 실행
   * - 엔터 키
   * - 하단 "다음" 버튼
   * - 최근 검색어 클릭
   */
  const submit = async (kw?: string) => {
    const keyword = (kw ?? text).trim();
    if (!keyword) return;

    // 최근 검색어 저장 (중복 제거 + 최신순)
    const next = await addRecent(keyword);
    setRecents(next);

    // 검색 결과 화면으로 이동
    navigation.navigate(RouteNames.SEARCH, {keyword});
  };

  /**
   * 최근 검색어 삭제
   */
  const onRemove = async (word: string) => {
    const next = await removeRecent(word);
    setRecents(next);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 상단 영역 */}
        <View style={styles.topRow}>
          {/* 뒤로가기 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
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
          {recents.length === 0 ? (
            <Text style={styles.empty}>최근 검색어가 없습니다.</Text>
          ) : (
            recents.map(word => (
              <View key={word} style={styles.chip}>
                {/* 검색어 클릭 → 바로 검색 */}
                <TouchableOpacity onPress={() => submit(word)}>
                  <Text style={styles.chipText}>{word}</Text>
                </TouchableOpacity>

                {/* 검색어 삭제 */}
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
