import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from '../../routes';
import NotificationScreen from '../screens/character/notification/NotificationScreen';

const Stack = createNativeStackNavigator();

/**
 * 탭바가 없는 전체 화면 스택 네비게이터
 */
const FullScreenStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 알림 화면 */}
      <Stack.Screen
        name={RouteNames.CHARACTER_NOTIFICATION}
        component={NotificationScreen}
      />
      {/* 추후 탭바 없는 다른 화면들 추가 가능 */}
      {/* 예: 설정, 프로필 상세 등 */}
    </Stack.Navigator>
  );
};

export default FullScreenStackNavigator;
