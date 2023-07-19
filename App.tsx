import React from 'react';
import {Provider} from 'react-redux';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Homescreen from './src/screens/Homescreen';
import Signup from './src/components/Authentication/Signup';
import Signin from './src/components/Authentication/Signin';
import store from './src/redux/store';
import Authentication from './src/navigation';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}}>
        <Authentication />
        {/* <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Authentication"
              component={Authentication}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
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
        </NavigationContainer> */}
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default App;
