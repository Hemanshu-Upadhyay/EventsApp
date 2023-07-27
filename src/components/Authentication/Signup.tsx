import React, {useState} from 'react';
import {View, TextInput, Alert, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button} from 'react-native-elements';

const Signup = ({navigate}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstname || !lastname || !email || !password) {
      Alert.alert('Signup Failed', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        'https://2fm3on5exc.execute-api.us-east-1.amazonaws.com/user/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
          }),
        },
      );

      if (response.ok) {
        // Save signup data in AsyncStorage
        try {
          const userData = {firstname, lastname, email, password};
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          Alert.alert('Signup Successful');
          setEmail(''), setPassword(''), setFirstname(''), setLastname('');
          navigate('Signin');
        } catch (error) {
          Alert.alert('Error', 'Failed to save signup data');
        }
      } else {
        Alert.alert('Signup Failed', 'Failed to create an account');
      }
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
    setLoading(false);
  };

  const handleSigninLink = () => {
    navigate('Signin');
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Input
        placeholder="First Name"
        value={firstname}
        onChangeText={text => setFirstname(text)}
        inputStyle={{color: '#F85F6A'}}
        containerStyle={{marginBottom: 16}}
      />
      <Input
        placeholder="Last Name"
        value={lastname}
        onChangeText={text => setLastname(text)}
        inputStyle={{color: '#F85F6A'}}
        containerStyle={{marginBottom: 16}}
      />
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
            'SignUp'
          ) : (
            <ActivityIndicator size="small" color="#444444" />
          )
        }
        disabled={loading}
        onPress={handleSignup}
        buttonStyle={{backgroundColor: '#F85F6A', width: 200}}
        containerStyle={{marginBottom: 16}}
      />
      <Text style={{color: '#888'}}>
        Already a user?{' '}
        <Text
          style={{color: '#F85F6A', textDecorationLine: 'underline'}}
          onPress={handleSigninLink}>
          Sign in
        </Text>
      </Text>
    </View>
  );
};

export default Signup;
