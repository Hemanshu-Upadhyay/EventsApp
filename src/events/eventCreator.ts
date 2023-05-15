import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
// import Geocoder from 'react-native-geocoding';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../../src/redux/store';
import {updateEvents} from '../redux/slices/eventsSlice';

const createEvent = async coords => {
  const startTimeStamp = new Date().getTime();
  let oldTime = await AsyncStorage.getItem('eventStartTime');
  let oldAddress = await AsyncStorage.getItem('currentAddress');

  // Storing the start time and address when app runs first time
  if (!oldTime) {
    AsyncStorage.setItem('eventStartTime', JSON.stringify(startTimeStamp));
  }

  if (!oldAddress) {
    AsyncStorage.setItem('currentAddress', JSON.stringify(coords));
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

    let currentAddress = JSON.stringify(coords);
    oldAddress = await AsyncStorage.getItem('currentAddress');
    oldTime = await AsyncStorage.getItem('eventStartTime');

    if (
      oldAddress !== currentAddress &&
      startTimeStamp - Number(oldTime) > 10000
    ) {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }

      CameraRoll.getPhotos({
        first: 500,
        assetType: 'Photos',
        fromTime: Number(oldTime),
        toTime: startTimeStamp,
      })
        .then(r => {
          const images = r.edges.map((item, i) => {
            return {
              id: i + 1,
              title: 'Anise Aroma Art Bazar',
              url: item?.node?.image?.uri,
              description:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            };
          });
          store.dispatch(updateEvents(images));
          console.log({photos: r.edges[0].node});
        })
        .catch(err => {
          console.log(err);
          //Error Loading Images
        });
      await AsyncStorage.setItem('currentAddress', JSON.stringify(coords));
      await AsyncStorage.setItem(
        'eventStartTime',
        JSON.stringify(startTimeStamp),
      );
    }

    // const {latitude, longitude} = coords;
    console.log('oldAddress !== currentAddress===', oldAddress, currentAddress);
  };

  checkAddressAndRetrieveImages();

  return null;
};

export default createEvent;
