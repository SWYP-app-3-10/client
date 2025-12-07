import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import SearchScreen from '../screens/main/SearchScreen';

const Stack = createNativeStackNavigator();

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.SEARCH} component={SearchScreen} />
      {/* 서브 화면들은 여기에 추가 */}
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
