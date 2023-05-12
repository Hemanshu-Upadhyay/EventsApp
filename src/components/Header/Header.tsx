import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../Icon';

const Header = ({title}) => {
  return (
    <View style={[styles.container, {marginTop: 20, marginBottom: 20}]}>
      <Icon icon="User" onPress={() => {}} />

      <Text style={styles.title}>{title}</Text>
      <Icon icon="Hamburger" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Header;
