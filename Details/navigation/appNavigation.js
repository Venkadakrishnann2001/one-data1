import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

 import AdminClient from '../screens/AdminClientPage';
 import AdminUser from '../screens/AdminUser';

 import AdminLogin from '../screens/AdminLogin';


const Stack = createNativeStackNavigator();



export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        
        {/* <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} /> */}
        <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
      
         <Stack.Screen name="AdminClient" options={{headerShown: false}} component={AdminClient} /> 
         <Stack.Screen name="AdminUser" options={{headerShown: false}} component={AdminUser} />
         <Stack.Screen name="AdminLogin" options={{headerShown: false}} component={AdminLogin} />
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}