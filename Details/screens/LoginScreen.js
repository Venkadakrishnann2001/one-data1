import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    // Reset previous error messages
    setEmailError('');
    setPasswordError('');
  
    // Basic validation
    if (!email) {
      setEmailError('Email is required');
    } else if (!isValidEmail(email)) {
      setEmailError('Invalid email format');
    }
  
    if (!password) {
      setPasswordError('Password is required');
    }
  
    // If no errors, perform login logic
    if (!emailError && !passwordError) {
      try {
        const response = await fetch('http://192.168.43.81:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        function isValidEmail(email) {
          // Use a regular expression to check if the email is in a valid format
          const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return emailPattern.test(email);
        }
        
        if (response.ok) {
          // Login successful, handle the response (e.g., save user data)
          const data = await response.json();
          // Handle the successful login response, e.g., save user data
    
          // Navigate to 'CarScreen' when login is successful
          navigation.navigate('EducationScreen');
        } else {
          // Handle login error (e.g., show error message to the user)
          const data = await response.json();
          // Handle the error response (e.g., display error message)
          Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
    
  };
  
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={require('../assets/images/login.png')} style={{ width: 310, height: 200 }} />
        </View>
      </SafeAreaView>
      <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }} className="flex-1 bg-white px-8 pt-8">
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {emailError ? <Text style={{ color: 'red', marginLeft: 16 }}>{emailError}</Text> : null}

          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {passwordError ? <Text style={{ color: 'red', marginLeft: 16 }}>{passwordError}</Text> : null}

          <TouchableOpacity className="flex items-end">
            <Text className="text-gray-700 mb-5">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} className="py-3 bg-yellow-400 rounded-xl">
            <Text className="text-xl font-bold text-center text-gray-700">Login</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>

        <View className="flex-row justify-center space-x-12">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image source={require('../assets/icons/google.png')}
              className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image source={require('../assets/icons/apple.png')}
              className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image source={require('../assets/icons/facebook.png')}
              className="w-10 h-10" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EducationScreen')}>
            <Text className="font-semibold text-yellow-500"> Education Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
