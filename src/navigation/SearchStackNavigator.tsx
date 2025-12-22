import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import SearchScreen from '../screens/main/SearchScreen';
import SearchInputScreen from '../screens/main/search/SearchInputScreen';
import type {SearchStackParamList} from './types';

/**
 * SearchStackNavigator
 *
 * - 검색 관련 화면들을 묶는 스택 네비게이터
 * - 메인 탐색/검색 결과 화면과 검색어 입력 화면으로 구성
 *
 * Screen 구성
 * - SEARCH        : SearchScreen
 *                   · 카테고리 기반 탐색
 *                   · 검색 결과 표시
 * - SEARCH_INPUT  : SearchInputScreen
 *                   · 검색어 입력
 *                   · 최근 검색어 관리
 */
const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 각 화면에서 커스텀 헤더 사용
      }}>
      {/* 메인 탐색 / 검색 결과 화면 */}
      <Stack.Screen name={RouteNames.SEARCH} component={SearchScreen} />

      {/* 검색어 입력 서브 화면 */}
      <Stack.Screen
        name={RouteNames.SEARCH_INPUT}
        component={SearchInputScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
