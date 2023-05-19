import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, Text, View, ScrollView} from 'react-native';
import BackgroundLocationService from './Services/LocationBackgroundService';
import BackgroundTask from './Services/BackgroundService';
import Homescreen from './src/screens/Homescreen';
import store from './src/redux/store';

type Props = PropsWithChildren<{}>;

const App = (props: Props) => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View>
            <Homescreen />
            <BackgroundLocationService />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
