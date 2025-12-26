import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from '../../routes';
import NotificationScreen from '../screens/common/NotificationScreen';
import ArticleDetailScreen from '../screens/common/ArticleDetailScreen';
import ReadArticleDetailScreen from '../screens/common/ReadArticleDetailScreen';
import QuizScreen from '../screens/common/QuizScreen';
import AdLoadingScreen from '../screens/common/AdLoadingScreen';
import CriteriaCheckScreen from '../screens/character/criteria/CriteriaCheckScreen';
import PointHistoryScreen from '../screens/character/history/PointHistoryScreen';

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
      {/* 기사 상세 화면 */}
      <Stack.Screen
        name={RouteNames.ARTICLE_DETAIL}
        component={ArticleDetailScreen}
      />
      {/* 읽은 글 상세 화면 */}
      <Stack.Screen
        name={RouteNames.READ_ARTICLE_DETAIL}
        component={ReadArticleDetailScreen}
      />
      {/* 퀴즈 화면 */}
      <Stack.Screen name={RouteNames.QUIZ} component={QuizScreen} />
      {/* 광고 로딩 화면 */}
      <Stack.Screen name={RouteNames.AD_LOADING} component={AdLoadingScreen} />
      {/* 레벨 기준 확인 화면 */}
      <Stack.Screen
        name={RouteNames.CHARACTER_CRITERIA}
        component={CriteriaCheckScreen}
      />
      {/* 포인트/경험치 내역 화면 */}
      <Stack.Screen
        name={RouteNames.CHARACTER_POINT_HISTORY}
        component={PointHistoryScreen}
      />
      {/* 추후 탭바 없는 다른 화면들 추가 가능 */}
    </Stack.Navigator>
  );
};

export default FullScreenStackNavigator;
