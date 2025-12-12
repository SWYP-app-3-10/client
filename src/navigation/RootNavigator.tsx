import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

interface RootNavigatorProps {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({
  isAuthenticated: _isAuthenticated,
  isOnboardingCompleted,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isOnboardingCompleted ? (
          // 온보딩 스택 (소셜 로그인 포함)
          <Stack.Screen
            name={RouteNames.ONBOARDING}
            component={OnboardingNavigator}
          />
        ) : (
          // 메인 스택 (온보딩 완료 후)
          <Stack.Screen
            name={RouteNames.MAIN_TAB}
            component={MainTabNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
