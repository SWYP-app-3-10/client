import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import MyPageScreen from '../screens/main/MyPageScreen';

const Stack = createNativeStackNavigator();

const MyPageStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.MY_PAGE} component={MyPageScreen} />
      {/* 서브 화면들은 여기에 추가 */}
    </Stack.Navigator>
  );
};

export default MyPageStackNavigator;
