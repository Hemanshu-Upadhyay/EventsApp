import React, {useState, useEffect} from 'react';
import {View, TextInput, Alert, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button} from 'react-native-elements';

// Import your HomeScreen and Signup components

import Homescreen from '../screens/Homescreen';
import Auth from '../screens/Auth';

const Authentication = () => {
  const [token, setToken] = useState(null); // Initialize token as null

  useEffect(() => {
    // Check for the token in AsyncStorage
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        Alert.alert('Error', 'Failed to retrieve token from storage');
      }
    };

    checkToken();
  }, []);

  return token ? (
    <Homescreen setToken={setToken} />
  ) : (
    <Auth setToken={setToken} />
  );
};

export default Authentication;
