import React, {useState} from 'react';
import {View, TextInput, Alert, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button} from 'react-native-elements';

const Signin = ({navigate, setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    // Perform signin logic here
    // Example code: validate email and password, make API request, etc.
    if (email && password) {
      setLoading(true);
      try {
        const response = await fetch(
          'https://2fm3on5exc.execute-api.us-east-1.amazonaws.com/user/signin',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          const token = data.acccessToken;

          // Save the JWT token in AsyncStorage or secure storage
          await AsyncStorage.setItem('token', token);
          setToken(token);

          // Signin successful
          Alert.alert('Signin Successful');

          // Redirect to the home screen or any authenticated page
          setEmail(''), setPassword('');
          console.log(token);
          navigate('Home');
        } else {
          // Signin failed
          Alert.alert('Signin Failed', 'Invalid email or password');
        }
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
        Alert.alert('Error', 'Something went wrong');
      }
      setLoading(false);
    } else {
      // Signin failed
      Alert.alert('Signin Failed', 'Please enter valid email and password');
    }
  };

  const handleSignupLink = () => {
    navigate('Signup');
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        inputStyle={{color: '#F85F6A'}}
        containerStyle={{marginBottom: 16}}
      />
      <Input
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
        inputStyle={{color: '#F85F6A'}}
        containerStyle={{marginBottom: 16}}
      />
      <Button
        title={
          !loading ? (
            'Sign In'
          ) : (
            <ActivityIndicator size="small" color="#444444" />
          )
        }
        onPress={handleSignin}
        disabled={loading}
        buttonStyle={{backgroundColor: '#F85F6A', width: 200}}
        containerStyle={{marginBottom: 16}}
      />
      <Text style={{color: '#888'}}>
        New user?{' '}
        <Text
          style={{color: '#F85F6A', textDecorationLine: 'underline'}}
          onPress={handleSignupLink}>
          Signup
        </Text>
      </Text>
    </View>
  );
};

export default Signin;
