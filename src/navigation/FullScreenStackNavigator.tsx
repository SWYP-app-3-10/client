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
import SettingScreen from '../screens/myPage/SettingScreen';
import LoginInfoScreen from '../screens/myPage/LoginInfoScreen';
import InquiryScreen from '../screens/myPage/InquiryScreen';
import TermsOfServiceScreen from '../screens/myPage/TermOfServiceScreen';
import PrivacyPolicyScreen from '../screens/myPage/PrivacyPolicyScreen';

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

      {/* 마이페이지 서브 */}
      <Stack.Screen name={RouteNames.SETTINGS} component={SettingScreen} />
      <Stack.Screen name={RouteNames.LOGIN_INFO} component={LoginInfoScreen} />
      <Stack.Screen name={RouteNames.INQUIRY} component={InquiryScreen} />
      <Stack.Screen
        name={RouteNames.TERMS_OF_SERVICE}
        component={TermsOfServiceScreen}
      />
      <Stack.Screen
        name={RouteNames.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
};

export default FullScreenStackNavigator;
