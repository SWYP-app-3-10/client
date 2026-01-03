import React, { useMemo } from 'react';

import { RouteNames } from '../../routes';
import MissionStackNavigator from './MissionStackNavigator';
import CharacterStackNavigator from './CharacterStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';
import MyPageStackNavigator from './MyPageStackNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CharacterIcon, HomeIcon, Search_tab_Icon, MyPageIcon } from '../icons';
import { COLORS } from '../styles/global';

const Tab = createBottomTabNavigator();

// tabBarIcon 생성 헬퍼 함수 (컴포넌트 외부에 정의)
type IconComponent = React.ComponentType<{ color: string }>;
const createTabBarIcon = (Icon: IconComponent) => {
  return ({ focused }: { focused: boolean }) => (
    <Icon color={focused ? COLORS.puple.main : COLORS.gray500} />
  );
};

const MainTabNavigator = () => {
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.puple.main,
      tabBarInactiveTintColor: COLORS.gray400,
    }),
    [],
  );

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      initialRouteName={RouteNames.MAIN_TAB}
    >
      <Tab.Screen
        name={RouteNames.MISSION_TAB}
        component={MissionStackNavigator}
        options={{
          tabBarIcon: createTabBarIcon(HomeIcon),
        }}
      />
      <Tab.Screen
        name={RouteNames.CHARACTER_TAB}
        component={CharacterStackNavigator}
        options={{
          tabBarIcon: createTabBarIcon(CharacterIcon),
        }}
      />
      <Tab.Screen
        name={RouteNames.SEARCH_TAB}
        component={SearchStackNavigator}
        options={{
          tabBarIcon: createTabBarIcon(Search_tab_Icon),
        }}
      />
      <Tab.Screen
        name={RouteNames.MY_PAGE_TAB}
        component={MyPageStackNavigator}
        options={{
          tabBarIcon: createTabBarIcon(MyPageIcon),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
