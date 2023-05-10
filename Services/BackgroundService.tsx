import BackgroundService from 'react-native-background-actions';
import React, {useState} from 'react';
import {
  View,
  Button,
  Platform,
  ToastAndroid,
  Alert,
  AppState,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

interface TaskDataArguments {
  delay: number;
}

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: TaskDataArguments) => {
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      showNotification(i);
      await sleep(delay);
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
