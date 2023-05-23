import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Platform,
  ToastAndroid,
  Alert,
  AppState,
  PermissionsAndroid,
  HeadlessJsTaskSupport,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Geolocation from '@react-native-community/geolocation';
import createEvent from '../src/events/eventCreator';
import {useDispatch} from 'react-redux';
import {getEvents, uploadEventPhotos} from '../src/redux/slices/eventsSlice';
import {MAPS_API_KEY} from '@env';

Geocoder.init(MAPS_API_KEY);
interface TaskDataArguments {
  delay: number;
}

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: TaskDataArguments) => {
  const {delay} = taskDataArguments;

  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log('i=', i);
      if (i % 10 === 0) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            showNotification(position.coords);
            const {latitude, longitude} = position.coords;
            Geocoder.from(latitude, longitude)
              .then(response => {
                const address = response.results[0].formatted_address;
                createEvent(address, latitude, longitude);
              })
              .catch(error => {
                console.warn('Geocoding error:', error);
              });
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 1000 * 60,
          },
        );
      }
      await sleep(delay);
    }
    // resolve();
  });
};

const options = {
  taskName: 'Location Tracking',
  taskTitle: 'Location Tracking',
  taskDesc: 'Location Tracking',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane',
  parameters: {
    delay: 1000,
  },
  allowExecutionInForeground: true,
};

const showNotification = (coords: GeolocationCoordinates) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`,
      ToastAndroid.SHORT,
    );
  } else if (Platform.OS === 'ios') {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Background Task',
      alertBody: `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`,
      applicationIconBadgeNumber: 1,
    });
  }
};

const showCounter = (num: number) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(`count: ${num}`, ToastAndroid.SHORT);
  }
};

const registerHeadlessTask = () => {
  HeadlessJsTaskSupport.addEvent(
    'LocationTracking',
    () => veryIntensiveTask(options.parameters),
    options,
  );
};

const BackgroundLocationService = () => {
  const dispatch = useDispatch();
  const [isRunning, setIsRunning] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    AppState?.addEventListener('change', handleAppStateChange);

    // Clean up event listener on unmount
    return () => {
      AppState?.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  console.log('APPstate==========', appState);
  if (appState === 'active') {
    dispatch(uploadEventPhotos());
  }

  const startTask = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to track it in the background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await BackgroundService.start(veryIntensiveTask, options);
        setIsRunning(true);
        await AsyncStorage.setItem('appStatus', 'running');
        registerHeadlessTask();
      } else {
        Alert.alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const stopTask = async () => {
    await AsyncStorage.setItem('appStatus', 'stopped');
    await AsyncStorage.removeItem('eventsForSync');
    await BackgroundService.stop();
    setIsRunning(false);
  };

  // const getAppStatus = () => {
  //   return AsyncStorage.getItem('appStatus');
  // };

  useEffect(() => {
    const getAppStatus = async () => {
      const runningStatus: null | string = await AsyncStorage.getItem(
        'appStatus',
      );
      console.log('running-----', runningStatus);
      if (runningStatus !== 'running') {
        console.log('HELOOOOOOOOOOO=-----------');
        startTask();
      }
    };
    getAppStatus();
  }, []);

  const clearStorage = () => {
    AsyncStorage.clear();
  };

  return (
    <View>
      {/* <Button title="Start Tracking" disabled={isRunning} onPress={startTask} /> */}
      <Button title="Stop Tracking" onPress={stopTask} />
      {/* <Button title="Clear Storage" onPress={clearStorage} /> */}
    </View>
  );
};

export default BackgroundLocationService;
