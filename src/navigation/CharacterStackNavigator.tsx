import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from '../../routes';
import CharacterScreen from '../screens/main/CharacterScreen';
import CriteriaCheckScreen from '../screens/character/criteria/CriteriaCheckScreen';
import PointHistoryScreen from '../screens/character/history/PointHistoryScreen';

const Stack = createNativeStackNavigator();

const CharacterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteNames.CHARACTER} component={CharacterScreen} />
      <Stack.Screen
        name={RouteNames.CHARACTER_CRITERIA}
        component={CriteriaCheckScreen}
      />
      <Stack.Screen
        name={RouteNames.CHARACTER_POINT_HISTORY}
        component={PointHistoryScreen}
      />
    </Stack.Navigator>
  );
};

export default CharacterStackNavigator;
