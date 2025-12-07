import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import DifficultySettingScreen from '../screens/onboarding/DifficultySettingScreen';
import InterestsScreen from '../screens/onboarding/InterestsScreen';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={RouteNames.DIFFICULTY_SETTING}
        component={DifficultySettingScreen}
      />
      <Stack.Screen name={RouteNames.INTERESTS} component={InterestsScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
