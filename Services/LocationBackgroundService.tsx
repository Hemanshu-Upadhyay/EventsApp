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

import BackgroundGeolocation, {
  Location,
  State,
  MotionActivityEvent,
  Subscription,
} from 'react-native-background-geolocation';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Geolocation from '@react-native-community/geolocation';
import createEvent from '../src/events/eventCreator';
import {useDispatch} from 'react-redux';
import store from '../src/redux/store';
import {getEvents, uploadEventPhotos} from '../src/redux/slices/eventsSlice';
import {request, PERMISSIONS} from 'react-native-permissions';

Geocoder.init('AIzaSyB8iCzJlmSC8Ku6pStVH1l-qVjZi65H96k');
interface TaskDataArguments {
  delay: number;
}

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: TaskDataArguments) => {
  const {delay} = taskDataArguments;

  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      if (i % 10 === 0) {
        const eventsForSync = await AsyncStorage.getItem('eventsForSync');
        const uploadingSlot = await AsyncStorage.getItem('uploadingSlot');
        console.log(
          'EVENTS IN STORAGE & SLOT+==========',
          eventsForSync,
          uploadingSlot,
        );
        if (
          eventsForSync !== null &&
          AppState.currentState === 'active' &&
          uploadingSlot !== 'occupied'
        ) {
          console.log('DISPATCHING UPLOADING==========', eventsForSync);
          store.dispatch(uploadEventPhotos(JSON.parse(eventsForSync)));
          await AsyncStorage.setItem('uploadingSlot', 'occupied');
        }
        console.log('APPSTATe+++++++++', AppState.currentState);
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
            timeout: 50000,
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

const registerHeadlessTask = () => {
  HeadlessJsTaskSupport.addEvent(
    'LocationTracking',
    () => veryIntensiveTask(options.parameters),
    options,
  );
};

const BackgroundLocationService = () => {
  const dispatch = useDispatch();

  const [isMoving, setIsMoving] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState<Location>(null);
  const [motionActivityEvent, setMotionActivityEvent] =
    React.useState<MotionActivityEvent>(null);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const getPhotoLibAccess = () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(res => {
        console.log('access to photo lib :: ', res);
      });
    }
  };
  const startTask = async () => {
    try {
      let granted = null;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
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
      } else if (Platform.OS === 'ios') {
        granted = await request(
          parseInt(Platform.Version, 10) < 13
            ? PERMISSIONS.IOS.LOCATION_ALWAYS
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
      }

      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        granted === 'granted'
      ) {
        await BackgroundService.start(veryIntensiveTask, options);
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
    await AsyncStorage.removeItem('uploadingSlot');
    await BackgroundGeolocation.stop();
  };

  const startImageUploading = async () => {
    const eventsForSync = await AsyncStorage.getItem('eventsForSync');
    const uploadingSlot = await AsyncStorage.getItem('uploadingSlot');
    console.log(
      'EVENTS IN STORAGE & SLOT+==========',
      eventsForSync,
      uploadingSlot,
    );
    if (
      eventsForSync !== null &&
      AppState.currentState === 'active' &&
      uploadingSlot !== 'occupied'
    ) {
      console.log('DISPATCHING UPLOADING==========', eventsForSync);
      store.dispatch(uploadEventPhotos(JSON.parse(eventsForSync)));
      await AsyncStorage.setItem('uploadingSlot', 'occupied');
    }
  };

  const initBackgroundGeolocation = async () => {
    // Get an authorization token from transistorsoft demo server.
    const token =
      await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(
        'org',
        'events-app-user',
        // ENV.TRACKER_HOST,
        'https://tracker.transistorsoft.com',
      );

    // Ready the SDK and fetch the current state.
    const state: State = await BackgroundGeolocation.ready({
      // Debug
      reset: false,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      transistorAuthorizationToken: token,
      // Geolocation
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // disableElasticity: true,
      stopTimeout: 1,
      // Permissions
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title:
          "Allow {applicationName} to access this device's location even when closed or not in use.",
        message:
          'This app collects location data to enable recording your trips to work and calculate distance-travelled.',
        positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
        negativeAction: 'Cancel',
      },
      // HTTP & Persistence
      autoSync: true,
      maxDaysToPersist: 14,
      // Application
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    });
    console.log('state----', state);
    setEnabled(state.trackingMode);
  };

  // useEffect(() => {}, [enabled]);
  const _handleAppStateChange = () => {};

  const [eventsForSync, setEventsForSync] = useState(null);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const getStorageValues = async () => {
    const events = await AsyncStorage.getItem('eventsForSync');
    const slot = await AsyncStorage.getItem('uploadingSlot');
    console.log(
      'EVENTS IN STORAGE & SLOT+==========',
      eventsForSync,
      uploadingSlot,
    );
    setEventsForSync(events);
    setUploadingSlot(slot);
  };
  getStorageValues();

  useEffect(() => {
    console.log(
      'INSIDE USEFFECT RUNNING---------',
      eventsForSync,
      AppState.currentState,
      uploadingSlot,
    );
    startImageUploading();
  }, [eventsForSync, uploadingSlot]);

  React.useEffect(() => {
    // Register BackgroundGeolocation event-listeners.
    const getAppStatus = async () => {
      const runningStatus: null | string = await AsyncStorage.getItem(
        'appStatus',
      );
      console.log('running-----', runningStatus);
      return runningStatus;
    };
    BackgroundGeolocation.getState().then(async data => {
      if (data.trackingMode === 1) {
        const runningStatus = await getAppStatus();
        console.log('running status===========', runningStatus);

        if (runningStatus !== 'running') {
          console.log('HELOOOOOOOOOOO=-----------');
          // startTask();
          BackgroundGeolocation.start();
        }
      }
    });
    const onLocation: Subscription = BackgroundGeolocation.onLocation(l => {
      console.log('[onLocation]', l);
      setLocation(l);
    });

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
      event => {
        console.log('[onMotionChange]', event);
      },
    );

    const onActivityChange: Subscription =
      BackgroundGeolocation.onActivityChange(event => {
        console.log('[onActivityChange]', event);
      });

    const onProviderChange: Subscription =
      BackgroundGeolocation.onProviderChange(event => {
        console.log('[onProviderChange]', event);
      });
    initBackgroundGeolocation();

    // AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      // When view is destroyed (or refreshed with dev live-reload),
      // Remove BackgroundGeolocation event-listeners.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  useEffect(() => {
    if (location && location.coords) {
      const {longitude, latitude} = location.coords;
      Geocoder.from(latitude, longitude)
        .then(response => {
          const address = response.results[0]?.formatted_address; // Added null check for address
          console.log('ADDRESS_-----', address);
          createEvent(address, latitude, longitude);
        })
        .catch(error => {
          console.warn('Geocoding error:', error);
        });
    }
  }, [location]);
  console.log('state values-----', enabled, location);
  // useEffect(() => {
  //   const getAppStatus = async () => {
  //     const runningStatus: null | string = await AsyncStorage.getItem(
  //       'appStatus',
  //     );
  //     console.log('running-----', runningStatus);
  //     if (runningStatus !== 'running') {
  //       console.log('HELOOOOOOOOOOO=-----------');
  //       startTask();
  //     }
  //   };
  //   getAppStatus();
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('wow');
  //     getPhotoLibAccess();
  //   }, 15000);
  // }, []);

  return (
    <View>
      {/* <Button title="Start Tracking" disabled={isRunning} onPress={startTask} /> */}
      <Button title="Stop Tracking" onPress={stopTask} />
      {/* <Button title="Photo Lib" onPress={getPhotoLibAccess} /> */}
      {/* <Button title="Clear Storage" onPress={clearStorage} /> */}
    </View>
  );
};

export default BackgroundLocationService;
