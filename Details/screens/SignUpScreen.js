import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { themeColors } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [errors, setErrors] = useState({});

  const handleSignUp = async () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone Number is required';
    }
    

    if (Object.keys(errors).length === 0) {
      try {
        // Send user registration data to your Node.js backend
        const response = await fetch('http://192.168.43.81:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName, email, password, phoneNumber }),
        });

        if (response.ok) {
          // Registration successful, navigate to the login screen
          navigation.navigate('Login');
        } else {
          // Handle registration error
          const data = await response.json();
          setErrors(data);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    } else {
      // Set the errors state to display error messages
      setErrors(errors);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
    <SafeAreaView className="flex">
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center">
        <Image source={require('../assets/images/signup.png')}
          style={{ width: 275, height: 170 }} />
      </View>
    </SafeAreaView>
    <View className="flex-1 bg-white px-8 pt-8"
      style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
    >
      <View className="form space-y-2">
        <Text className="text-gray-700 ml-4">Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
          placeholder='Enter Name'
        />
        {errors.fullName && <Text>{errors.fullName}</Text>}

        <Text className="text-gray-700 ml-4">Email Address</Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
          placeholder='Enter Email'
        />
        {errors.email && <Text>{errors.email}</Text>}

        <Text className="text-gray-700 ml-4">Password</Text>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
          secureTextEntry
          placeholder='Enter Password'
        />
        {errors.password && <Text>{errors.password}</Text>}
        <Text className="text-gray-700 ml-4">Phone Number</Text>
<TextInput
  value={phoneNumber}
  onChangeText={(text) => setPhoneNumber(text)}
  className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
  placeholder="Enter Phone Number"
/>
{errors.phoneNumber && <Text>{errors.phoneNumber}</Text>}


        <TouchableOpacity
          onPress={handleSignUp}
          className="py-3 bg-yellow-400 rounded-xl"
        >
          <Text className="font-xl font-bold text-center text-gray-700">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xl text-gray-700 font-bold text-center py-5">
        Or
      </Text>
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
        <Text className="text-gray-500 font-semibold">Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="font-semibold text-yellow-500"> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>

    
  );
}
