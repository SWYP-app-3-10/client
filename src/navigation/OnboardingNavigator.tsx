import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import LoginScreen from '../screens/auth/LoginScreen';
import FeatureIntroduction01Screen from '../screens/onboarding/FeatureIntroduction01Screen';

import InterestsScreen from '../screens/onboarding/InterestsScreen';
import DifficultySettingScreen from '../screens/onboarding/DifficultySettingScreen';
import REWARDScreen from '../screens/REWARDScreen';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={RouteNames.COMPONENT_SHOWCASE}>
      <Stack.Screen name={RouteNames.SOCIAL_LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={RouteNames.FEATURE_INTRO_01}
        component={FeatureIntroduction01Screen}
      />
      <Stack.Screen name={RouteNames.INTERESTS} component={InterestsScreen} />
      <Stack.Screen
        name={RouteNames.DIFFICULTY_SETTING}
        component={DifficultySettingScreen}
      />
      <Stack.Screen name={RouteNames.REWARD} component={REWARDScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
