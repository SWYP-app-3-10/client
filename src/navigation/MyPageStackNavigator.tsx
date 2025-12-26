import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteNames } from '../../routes';

import MyPageScreen from '../screens/main/MyPageScreen';
import SettingScreen from '../screens/myPage/SettingScreen';
import LoginInfoScreen from '../screens/myPage/LoginInfoScreen';
import InquiryScreen from '../screens/myPage/InquiryScreen';
import TermsOfServiceScreen from '../screens/myPage/TermOfServiceScreen';

const Stack = createNativeStackNavigator();

const MyPageStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={RouteNames.MY_PAGE}
      screenOptions={{ headerShown: false }}
    >
      {/* 마이페이지 메인 */}
      <Stack.Screen name={RouteNames.MY_PAGE} component={MyPageScreen} />

      {/* 설정 */}
      <Stack.Screen name={RouteNames.SETTINGS} component={SettingScreen} />

      {/* 설정 하위 */}
      <Stack.Screen name={RouteNames.LOGIN_INFO} component={LoginInfoScreen} />
      <Stack.Screen name={RouteNames.INQUIRY} component={InquiryScreen} />
      <Stack.Screen
        name={RouteNames.TERMS_OF_SERVICE}
        component={TermsOfServiceScreen}
      />
    </Stack.Navigator>
  );
};

export default MyPageStackNavigator;
