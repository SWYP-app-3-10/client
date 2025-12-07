import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import CharacterScreen from '../screens/main/CharacterScreen';

const Stack = createNativeStackNavigator();

const CharacterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.CHARACTER} component={CharacterScreen} />
      {/* 서브 화면들은 여기에 추가 */}
    </Stack.Navigator>
  );
};

export default CharacterStackNavigator;
