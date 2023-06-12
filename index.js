/**
 * @format
 */

import { AppRegistry } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import createEvent from './src/events/eventCreator';
import Geocoder from 'react-native-geocoding';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

const BackgroundGeolocationHeadlessTask = async (event) => {
  let params = event.params;
  console.log('[BackgroundGeolocation HeadlessTask] -', event.name, params);

  switch (event.name) {
    case 'location':
      const { longitude, latitude } = params.coords
      Geocoder.from(latitude, longitude)
        .then(response => {
          const address = response.results[0].formatted_address;
          console.log('ADDRESS_-----', address);
          createEvent(address, latitude, longitude);
        })
        .catch(error => {
          console.warn('Geocoding error:', error);
        });
      break;
    case 'terminate':
      /**
      * Enable this block to execute #getCurrentPosition in headless heartbeat event (will consume more power)
      *
      *
      */
      // Use await for async tasks
      // const location = await BackgroundGeolocation.getCurrentPosition({
      //   samples: 1,
      //   persist: false
      // });
      // console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
      break;
    case 'authorization':
      BackgroundGeolocation.setConfig({
        url: 'https://tracker.transistorsoft.com/api/locations'
      });
      break;
  }
}


BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);
