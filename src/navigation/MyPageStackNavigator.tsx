import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../../routes';
import MyPageScreen from '../screens/main/MyPageScreen';
import ComponentShowcaseScreen from '../screens/ComponentShowcaseScreen';

const Stack = createNativeStackNavigator();

const MyPageStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={RouteNames.MY_PAGE} component={MyPageScreen} />
      <Stack.Screen
        name={RouteNames.COMPONENT_SHOWCASE}
        component={ComponentShowcaseScreen}
      />
    </Stack.Navigator>
  );
};

export default MyPageStackNavigator;
