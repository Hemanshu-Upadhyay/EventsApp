import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Platform,
  ToastAndroid,
  Alert,
  AppState,
  PermissionsAndroid,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Geolocation from '@react-native-community/geolocation';
import createEvent from '../src/events/eventCreator';

interface TaskDataArguments {
  delay: number;
}

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: TaskDataArguments) => {
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          showNotification(position.coords);
          createEvent('931 Twin Willow Lane');
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000 * 60,
        },
      );
      await sleep(delay);
    }
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
    delay: 10000,
  },
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

const BackgroundLocationService = () => {
  const [isRunning, setIsRunning] = useState(false);

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
      } else {
        Alert.alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const stopTask = async () => {
    await BackgroundService.stop();
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      BackgroundService.stop();
    };
  }, []);

  const clearStorage = () => {
    AsyncStorage.clear();
  };

  const changeAddress = async () => {
    await AsyncStorage.setItem('currentAddress', '96 Spring Street 2');
  };

  return (
    <View>
      <Button title="Start Tracking" disabled={isRunning} onPress={startTask} />
      <Button title="Stop Tracking" disabled={!isRunning} onPress={stopTask} />
      <Button title="Change Address" onPress={changeAddress} />
      <Button title="Clear Storage" onPress={clearStorage} />
    </View>
  );
};

export default BackgroundLocationService;