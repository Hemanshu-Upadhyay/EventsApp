import React, {useState, useEffect} from 'react';
import {Provider} from 'react-redux';
import {SafeAreaView, ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Homescreen from './src/screens/Homescreen';
import Signup from './src/components/Authentication/Signup';
import Signin from './src/components/Authentication/Signin';
import store from './src/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Authentication from './src/navigation';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Authentication"
              component={Authentication}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Homescreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
