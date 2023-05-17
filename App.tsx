/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import BackgroundLocationService from './Services/LocationBackgroundService';
import BackgroundTask from './Services/BackgroundService';
import Homescreen from './src/screens/Homescreen';
import store from './src/redux/store';
type Props = PropsWithChildren<{}>;

const App = (props: Props) => {
  return (
    <Provider store={store}>
      <SafeAreaView>
        <View>
          <Homescreen />
          <BackgroundLocationService />
          <BackgroundTask />
        </View>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
