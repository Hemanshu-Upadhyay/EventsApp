import {PermissionsAndroid, Platform} from 'react-native';
// import Geocoder from 'react-native-geocoding';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../../src/redux/store';
import {createEvent, updateEvents} from '../redux/slices/eventsSlice';
import {formatTime} from '../utils/helpers';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const eventCreator = async (coords: string, latitude, longitude) => {
  const startTimeStamp = new Date().getTime();

  let oldTime = await AsyncStorage.getItem('eventStartTime');
  let oldAddress = await AsyncStorage.getItem('currentAddress');

  // Storing the start time and address when app runs first time
  if (!oldTime) {
    await AsyncStorage.setItem(
      'eventStartTime',
      JSON.stringify(startTimeStamp),
    );
  }

  if (!oldAddress) {
    await AsyncStorage.setItem('currentAddress', JSON.stringify(coords));
  }

  const checkAddressAndRetrieveImages = async () => {
    async function hasAndroidPermission() {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }
      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }

    let currentAddress = coords;
    oldTime = await AsyncStorage.getItem('eventStartTime');
    oldAddress = await AsyncStorage.getItem('currentAddress');
    if (
      JSON.parse(oldAddress) !== currentAddress &&
      startTimeStamp - Number(oldTime) > 10000
    ) {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }

      // iOS permission check
      if (Platform.OS === 'ios') {
        try {
          const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
          console.log(status);
          if (status !== RESULTS.GRANTED) {
            try {
              const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
              if (status !== RESULTS.GRANTED) {
                console.log('Permission Denied');
                return;
              }
            } catch (err) {
              console.log(err);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }

      CameraRoll.getPhotos({
        first: 50,
        assetType: 'Photos',
        fromTime: Number(oldTime),
        toTime: startTimeStamp,
        include: ['filename'],
        // iOS-specific properties
        // groupTypes: 'All', (by default its value is 'All')
        // mimeTypes: ['image/jpeg', 'image/png'],
      })
        .then(async r => {
          console.log({photos: r?.edges[0]?.node});
          const images = r.edges.map(item => {
            return {
              uri: item?.node?.image?.uri,
              filename: item?.node?.image?.filename,
            };
          });
          console.log(
            'creating new event 000000000000000000000000000000---',
            JSON.parse(oldAddress),
          );
          const body = {
            latitude,
            longitude,
            google_lookup: JSON.parse(oldAddress),
            begin_timestamp: formatTime(Number(oldTime)),
            end_timestamp: formatTime(startTimeStamp),
            title: JSON.parse(oldAddress),
            category: 'Events pics',
          };
          store.dispatch(
            createEvent({
              body,
              images: images,
              coords: JSON.parse(oldAddress),
              startTimeStamp,
            }),
          );
          await AsyncStorage.setItem('currentAddress', JSON.stringify(coords));
          await AsyncStorage.setItem(
            'eventStartTime',
            JSON.stringify(startTimeStamp),
          );
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  checkAddressAndRetrieveImages();

  return null;
};

export default eventCreator;
