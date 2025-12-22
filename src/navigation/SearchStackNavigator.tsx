import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from '../../routes';
import SearchScreen from '../screens/search/SearchScreen';
import SearchInputScreen from '../screens/search/SearchInputScreen';
import { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteNames.SEARCH} component={SearchScreen} />
      <Stack.Screen
        name={RouteNames.SEARCH_INPUT}
        component={SearchInputScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
