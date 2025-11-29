import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from './routes';
import HomeScreen from './src/screens/HomeScreen';
import HomeScreen1 from './src/screens/HomeScreen1';
import Test from './src/screens/Test';
import Test1 from './src/screens/Test1';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'black',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
      }}>
      <Tab.Screen
        name={RouteNames.Home}
        component={HomeScreen}
        options={{tabBarLabel: '홈'}}
      />
      <Tab.Screen
        name={RouteNames.Home1}
        component={HomeScreen1}
        options={{tabBarLabel: '홈1'}}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={RouteNames.HOME_TAB}
          options={{headerShown: false}}
          component={HomeTab}
        />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name={RouteNames.Test1} component={Test1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
