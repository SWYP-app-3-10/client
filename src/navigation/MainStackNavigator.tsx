import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import MissionStackNavigator from './MissionStackNavigator';
import CharacterStackNavigator from './CharacterStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';
import MyPageStackNavigator from './MyPageStackNavigator';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={RouteNames.MISSION}
        component={MissionStackNavigator}
      />
      <Stack.Screen
        name={RouteNames.CHARACTER}
        component={CharacterStackNavigator}
      />
      <Stack.Screen name={RouteNames.SEARCH} component={SearchStackNavigator} />
      <Stack.Screen
        name={RouteNames.MY_PAGE}
        component={MyPageStackNavigator}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
