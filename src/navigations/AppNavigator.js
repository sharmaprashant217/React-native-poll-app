import {View, Text, LogBox} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import AddPoll from '../screens/AddPoll';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Signup" component={Signup} options={{title: ''}} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddPoll"
          component={AddPoll}
          options={{headerShown: true, title: 'Add New Poll'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
