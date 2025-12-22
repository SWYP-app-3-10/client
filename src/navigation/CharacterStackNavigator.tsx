import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';

import CharacterScreen from '../screens/main/CharacterScreen';
import CriteriaCheckScreen from '../screens/main/character/criteria/CriteriaCheckScreen';
import PointHistoryScreen from '../screens/main/character/history/PointHistoryScreen';
import NotificationScreen from '../screens/main/character/notification/NotificationScreen';

import type {CharacterStackParamList} from './types';

/**
 * CharacterStackNavigator
 *
 * - 캐릭터 탭에서 사용하는 스택 네비게이터
 * - 캐릭터 메인 화면과 관련 서브 기능 화면들을 관리
 *
 * Screen 구성
 * - CHARACTER
 *   · CharacterScreen
 *   · 캐릭터 메인 화면
 *
 * - CHARACTER_CRITERIA
 *   · CriteriaCheckScreen
 *   · 레벨 / 경험치·포인트 기준 확인 화면
 *
 * - CHARACTER_POINT_HISTORY
 *   · PointHistoryScreen
 *   · 포인트 / 경험치 적립 내역 확인 화면
 *
 * - CHARACTER_NOTIFICATION
 *   · NotificationScreen
 *   · 캐릭터 관련 알림 목록 화면
 */
const Stack = createNativeStackNavigator<CharacterStackParamList>();

const CharacterStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 각 화면에서 커스텀 헤더 사용
      }}>
      {/* 캐릭터 메인 화면 */}
      <Stack.Screen name={RouteNames.CHARACTER} component={CharacterScreen} />

      {/* 기준 확인 화면 (레벨 / 경험치·포인트) */}
      <Stack.Screen
        name={RouteNames.CHARACTER_CRITERIA}
        component={CriteriaCheckScreen}
      />

      {/* 포인트 / 경험치 적립 내역 화면 */}
      <Stack.Screen
        name={RouteNames.CHARACTER_POINT_HISTORY}
        component={PointHistoryScreen}
      />

      {/* 알림 목록 화면 */}
      <Stack.Screen
        name={RouteNames.CHARACTER_NOTIFICATION}
        component={NotificationScreen}
      />
    </Stack.Navigator>
  );
};

export default CharacterStackNavigator;
