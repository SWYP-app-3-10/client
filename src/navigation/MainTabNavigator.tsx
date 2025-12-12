import React from 'react';

import {RouteNames} from '../../routes';
import MissionStackNavigator from './MissionStackNavigator';
import CharacterStackNavigator from './CharacterStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';
import MyPageStackNavigator from './MyPageStackNavigator';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={RouteNames.MAIN_TAB}>
      <Tab.Screen
        name={RouteNames.MISSION_TAB}
        component={MissionStackNavigator}
      />
      <Tab.Screen
        name={RouteNames.CHARACTER_TAB}
        component={CharacterStackNavigator}
      />
      <Tab.Screen
        name={RouteNames.SEARCH_TAB}
        component={SearchStackNavigator}
      />
      <Tab.Screen
        name={RouteNames.MY_PAGE_TAB}
        component={MyPageStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
