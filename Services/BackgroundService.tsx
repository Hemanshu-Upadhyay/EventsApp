import BackgroundService from 'react-native-background-actions';
import createEvent from '../src/events/eventCreator';
import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import {View, Button, Platform, ToastAndroid} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

interface TaskDataArguments {
  delay: number;
}

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskData?: {delay: number}): Promise<void> => {
  const taskDataArguments: TaskDataArguments = {
    delay: taskData?.delay || 10000,
  };

  await new Promise<void>(async () => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      showNotification(i);
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
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
      await sleep(taskDataArguments.delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane',
  parameters: {
    delay: 1000,
  },
};

const showNotification = (count: number) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      `Task is running in background: ${count}`,
      ToastAndroid.SHORT,
    );
  } else if (Platform.OS === 'ios') {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Background Task',
      alertBody: `Task is running in background: ${count}`,
      applicationIconBadgeNumber: count,
    });
  }
};

const BackgroundTask = () => {
  const [isRunning, setIsRunning] = useState(false);

  const startTask = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    setIsRunning(true);
  };

  const stopTask = async () => {
    await BackgroundService.stop();
    setIsRunning(false);
  };

  return (
    <View>
      <Button title="Start Task" disabled={isRunning} onPress={startTask} />
      <Button title="Stop Task" disabled={!isRunning} onPress={stopTask} />
    </View>
  );
};

export default BackgroundTask;
