import BackgroundService from 'react-native-background-actions';
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

interface TaskDataArguments {
  delay: number;
}

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: TaskDataArguments) => {
  const {delay} = taskDataArguments;
  for (let i = 0; true; i++) {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        showNotification(position.coords);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000 * 60,
      },
    );
    await sleep(delay);
  }
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
    delay: 3000,
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

const registerHeadlessTask = () => {
  HeadlessJsTaskSupport.addEvent(
    'LocationTracking',
    () => veryIntensiveTask(options.parameters),
    options,
  );
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
        registerHeadlessTask();
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

  return (
    <View>
      <Button title="Start Tracking" disabled={isRunning} onPress={startTask} />
      <Button title="Stop Tracking" disabled={isRunning} onPress={stopTask} />
    </View>
  );
};

export default BackgroundLocationService;
