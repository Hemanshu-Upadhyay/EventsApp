import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Platform,
  Alert,
  AppState,
  PermissionsAndroid,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  State,
  MotionActivityEvent,
  Subscription,
} from 'react-native-background-geolocation';

import createEvent from '../src/events/eventCreator';
import {useDispatch} from 'react-redux';
import store from '../src/redux/store';
import {uploadEventPhotos} from '../src/redux/slices/eventsSlice';
import {request, PERMISSIONS} from 'react-native-permissions';

// Geocoder.init(MAPS_API_KEY);

const BackgroundLocationService = () => {
  const [appState, setAppState] = React.useState('');
  const [isMoving, setIsMoving] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState<Location>(null);
  const [motionActivityEvent, setMotionActivityEvent] =
    React.useState<MotionActivityEvent>(null);

  const stopTask = async () => {
    await AsyncStorage.setItem('appStatus', 'stopped');
    await AsyncStorage.removeItem('eventsForSync');
    await AsyncStorage.removeItem('uploadingSlot');
    await AsyncStorage.removeItem('currentAddress');
    await BackgroundGeolocation.stop();
  };

  const addGeofence = () => {
    const {longitude, latitude} = location.coords;
    BackgroundGeolocation.addGeofence({
      identifier: 'Home',
      radius: 200,
      latitude,
      longitude,
      notifyOnEntry: true,
      notifyOnExit: true,
    })
      .then(success => {
        console.log('[addGeofence] success: ', success);
      })
      .catch(error => {
        console.log('[addGeofence] FAILURE: ', error);
      });
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
      distanceFilter: 100,
      disableElasticity: true,
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
  const _handleAppStateChange = appStatus => {
    setAppState(appStatus);
    console.log('app state changed =====------', appStatus);
  };

  const [eventsForSync, setEventsForSync] = useState(null);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const getStorageValues = async () => {
    const events = await AsyncStorage.getItem('eventsForSync');
    const slot = await AsyncStorage.getItem('uploadingSlot');
    // console.log(
    //   'EVENTS IN STORAGE & SLOT+==========',
    //   eventsForSync,
    //   uploadingSlot,
    // );
    setEventsForSync(events);
    setUploadingSlot(slot);
  };
  getStorageValues();

  useEffect(() => {
    console.log(
      'INSIDE USEFFECT RUNNING---------',
      eventsForSync,
      appState,
      uploadingSlot,
    );
    if (appState === 'active') {
      startImageUploading();
    }
  }, [eventsForSync, uploadingSlot, appState]);

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
        // console.log('running status===========', runningStatus);

        if (runningStatus !== 'running') {
          // console.log('HELOOOOOOOOOOO=-----------');
          // startTask();
          BackgroundGeolocation.start();
          await AsyncStorage.setItem('appStatus', 'running');
        }
      }
    });

    // BackgroundGeolocation.onGeofence(geofence => {
    //   console.log(
    //     '[geofence] >>>>>>>>>>>><<<<<<<<<<<',
    //     geofence.identifier,
    //     geofence,
    //   );
    // });

    const onLocation: Subscription = BackgroundGeolocation.onLocation(l => {
      // console.log('[onLocation]', l);
      // console.log('location update--=-=-=-', l);
      // const {longitude, latitude} = l.coords;
      // const address = `${latitude}/${longitude}`;
      // createEvent(address, latitude, longitude);
      // setLocation(l);
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

    AppState.addEventListener('change', _handleAppStateChange);

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
      console.log('location update--=-=-=-', location);
      const {longitude, latitude} = location.coords;
      const address = `${latitude}/${longitude}`;
      createEvent(address, latitude, longitude);
    }
  }, [location]);
  console.log('state values-----', enabled, location);

  return (
    <View>
      {/* <Button title="Start Tracking" disabled={isRunning} onPress={startTask} /> */}
      {/* <Button title="Stop Tracking" onPress={stopTask} /> */}
      {/* <Button title="Add Geofence" onPress={addGeofence} /> */}
      {/* <Button title="Photo Lib" onPress={getPhotoLibAccess} /> */}
      {/* <Button title="Clear Storage" onPress={clearStorage} /> */}
    </View>
  );
};

export default BackgroundLocationService;
