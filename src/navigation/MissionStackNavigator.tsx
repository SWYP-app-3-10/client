import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import MissionScreen from '../screens/main/MissionScreen';

const Stack = createNativeStackNavigator();

const MissionStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.MISSION} component={MissionScreen} />
      {/* 서브 화면들은 여기에 추가 */}
    </Stack.Navigator>
  );
};

export default MissionStackNavigator;
