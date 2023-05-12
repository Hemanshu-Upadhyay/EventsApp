import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CustomCarousel from '../components/Carousel/CustomCarousel';
import {dummyData} from '../../data/Data';
import Header from '../components/Header/Header';
import Card from '../components/Carousel/Caraousal';

const Homescreen = () => {
  return (
    <>
      <View>
        <Header title="Home" />
        <CustomCarousel data={dummyData} />
        {/* <CustomCarousel data={dummyData} /> */}
        {/* <Card /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    height: 50,
  },
  logo: {
    width: 100,
    height: 30,
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
    opacity: 0.2,
  },
});

export default Homescreen;
