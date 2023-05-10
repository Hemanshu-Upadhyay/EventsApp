/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import BackgroundLocationService from './Services/LocationBackgroundService';
import BackgroundTask from './Services/BackgroundService';

type Props = PropsWithChildren<{}>;

const App = (props: Props) => {
  return (
    <SafeAreaView>
      <View>
        <Text>App View</Text>
        <BackgroundLocationService />
        <BackgroundTask />
      </View>
    </SafeAreaView>
  );
};

export default App;
