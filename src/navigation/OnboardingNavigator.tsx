import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from '../../routes';
import LoginScreen from '../screens/auth/LoginScreen';
import InterestsScreen from '../screens/onboarding/InterestsScreen';
import DifficultySettingScreen from '../screens/onboarding/DifficultySettingScreen';
import REWARDScreen from '../screens/REWARDScreen';
import IntroCardList from '../screens/onboarding/IntroCardList';
import IntroFuction from '../screens/onboarding/IntroFuction';
import IntroSearch from '../screens/onboarding/IntroSearch';
import { useOnboardingStore } from '../store/onboardingStore';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  const currentStep = useOnboardingStore(state => state.currentStep);

  // 현재 단계에 따라 초기 화면 결정
  // difficulty 단계에서도 관심분야 화면으로 돌아가서 선택한 관심분야를 확인할 수 있도록 함
  const getInitialRouteName = () => {
    switch (currentStep) {
      case 'interests':
      case 'difficulty':
        return RouteNames.INTERESTS;
      case 'completed':
        return RouteNames.INTERESTS; // 완료된 경우는 RootNavigator에서 처리
      case 'login':
      default:
        return RouteNames.COMPONENT_SHOWCASE;
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRouteName()}
    >
      <Stack.Screen
        name={RouteNames.INTRO_CARDLIST}
        component={IntroCardList}
      />
      <Stack.Screen name={RouteNames.INTRO_FUNCTION} component={IntroFuction} />
      <Stack.Screen name={RouteNames.INTRO_SEARCH} component={IntroSearch} />
      <Stack.Screen name={RouteNames.SOCIAL_LOGIN} component={LoginScreen} />
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
