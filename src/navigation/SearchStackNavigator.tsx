import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import SearchScreen from '../screens/main/SearchScreen';
import SearchInputScreen from '../screens/main/search/SearchInputScreen';
import type {SearchStackParamList} from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

/**
 * - SEARCH        → SearchScreen (탐색 + 검색결과)
 * - SEARCH_INPUT  → SearchInputScreen (검색어 입력)
 */

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.SEARCH} component={SearchScreen} />
      {/* 서브 화면들은 여기에 추가 */}
      <Stack.Screen
        name={RouteNames.SEARCH_INPUT}
        component={SearchInputScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
