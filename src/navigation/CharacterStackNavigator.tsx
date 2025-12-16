import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import CharacterScreen from '../screens/main/CharacterScreen';
import LevelCriteriaScreen from '../screens/main/character/level/LevelCriteriaScreen';
import LevelCriteriaDetailScreen from '../screens/main/character/level/LevelCriteriaDetailScreen';
import PointHistoryScreen from '../screens/main/character/history/PointHistoryScreen';
import NotificationScreen from '../screens/main/character/notification/NotificationScreen';
import type {CharacterStackParamList} from './types';

const Stack = createNativeStackNavigator<CharacterStackParamList>();

const CharacterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.CHARACTER} component={CharacterScreen} />
      {/* 서브 화면들은 여기에 추가 */}

      <Stack.Screen
        name={RouteNames.CHARACTER_LEVEL}
        component={LevelCriteriaScreen}
      />
      <Stack.Screen
        name={RouteNames.CHARACTER_LEVEL_DETAIL}
        component={LevelCriteriaDetailScreen}
      />
      <Stack.Screen
        name={RouteNames.CHARACTER_POINT_HISTORY}
        component={PointHistoryScreen}
      />
      <Stack.Screen
        name={RouteNames.CHARACTER_NOTIFICATION}
        component={NotificationScreen}
      />
    </Stack.Navigator>
  );
};

export default CharacterStackNavigator;
