import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CustomCarousel from '../components/Carousel/CustomCarousel';
import {dummyData} from '../../data/Data';
import Header from '../components/Header/Header';
import Card from '../components/Carousel/Caraousal';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundLocationService from '../../Services/LocationBackgroundService';
import {getEvents} from '../redux/slices/eventsSlice';

const Homescreen = ({setToken}) => {
  const dispatch = useDispatch();

  const {events, error, loading} = useSelector(state => state.events);

  useEffect(() => {
    console.log('fetching VEENTSSS .......................');
    dispatch(getEvents());
  }, [dispatch]);

  const handleLogout = () => {
    console.log('Logout');
    AsyncStorage.removeItem('token');
    setToken(null);
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator style={styles.loader} size="large" color="#3b83f7" />
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text>Something went wrong! Please reload the app</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header handleLogout={handleLogout} title="Home" />
      {events.length ? (
        <FlatList
          data={events}
          // ref={ref => {
          //   flatList = ref;
          // }}
          initialNumToRender={10}
          windowSize={25}
          snapToAlignment={'start'}
          decelerationRate={'normal'}
          keyExtractor={item => `${item.id}_${Math.ceil(Math.random() * 1000)}`}
          pagingEnabled
          removeClippedSubviews
          scrollEnabled
          renderItem={({item}) => {
            return (
              <CustomCarousel
                key={`${item.id}_${Math.ceil(Math.random() * 1000)}`}
                data={item}
              />
            );
          }}
          // onScroll={handleScroll}
          // onMomentumScrollEnd={handleScroll}
        />
      ) : (
        <Text>No events to show</Text>
      )}
      {/* <Button
        title="SignOut"
        onPress={handleLogout}
        buttonStyle={{backgroundColor: '#F85F6A', width: '100%'}}
        // containerStyle={{marginBottom: 16}}
      /> */}
      <BackgroundLocationService />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
  listContent: {
    flexGrow: 1,
  },
  loader: {
    height: '100%',
    backgroundColor: '#eeeeee',
  },
});

export default Homescreen;
