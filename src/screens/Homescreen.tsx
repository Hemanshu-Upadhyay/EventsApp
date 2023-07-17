import React from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, Image, Text} from 'react-native';
import CustomCarousel from '../components/Carousel/CustomCarousel';
import {dummyData} from '../../data/Data';
import Header from '../components/Header/Header';
import Card from '../components/Carousel/Caraousal';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundLocationService from '../../Services/LocationBackgroundService';

const Homescreen = () => {
  const events = useSelector(state => state.events.events);

  const handleLogout = () => {
    console.log('Logout');
    AsyncStorage.removeItem('token');
  };
  return (
    <>
      <View>
        <Header title="Home" />
        {events.map(event => (
          <CustomCarousel key={event.id} data={event} />
        ))}

        <Button
          title="SignOut"
          onPress={handleLogout}
          buttonStyle={{backgroundColor: '#F85F6A', width: 200}}
          containerStyle={{marginBottom: 16}}
        />
        {/* <CustomCarousel data={events} /> */}
        {/* <CustomCarousel data={dummyData} /> */}
        {/* <Card /> */}
        <BackgroundLocationService />
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
