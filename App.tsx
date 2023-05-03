/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, Text, View} from 'react-native';

type Props = PropsWithChildren<{}>;

const App = (props: Props) => {
  return (
    <SafeAreaView>
      <View>
        <Text>App View</Text>
      </View>
    </SafeAreaView>
  );
};

export default App;
