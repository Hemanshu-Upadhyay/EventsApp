import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import makeRequest from '../../api';
import {
  createEventUrl,
  getEventsUrl,
  updateEventUrl,
  uploadEventPhotosUrl,
} from '../../api/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showNotification} from '../../utils/helpers';

const initialState = {
  events: [],
  loading: false,
  error: false,
  uploading: false,
  uploadError: false,
};

export const getEvents = createAsyncThunk('events/getEvents', async () => {
  try {
    const response = await makeRequest(getEventsUrl());
    if (response.status === 200) {
      const events = response.data.data;
      const eventsForSync = await AsyncStorage.getItem('eventsForSync');
      let mappedEvents = [];
      if (eventsForSync !== null) {
        const keys = Object.keys(JSON.parse(eventsForSync));
        mappedEvents = events.map(event => {
          if (keys.includes(event.id.toString())) {
            const tempPhotos = JSON.parse(eventsForSync)[
              event.id.toString()
            ].map(p => {
              return {url: p.uri, id: event.id};
            });
            return {...event, photos: tempPhotos};
          } else {
            return event;
          }
        });
      } else {
        mappedEvents = events;
      }
      return mappedEvents;
    } else {
      throw new Error();
    }
  } catch (error) {
    return {error: 'Some Error Occured, please reload.'};
  }
});

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (data: object, {dispatch}) => {
    try {
      const body = data.body;
      const images = data.images;

      const response = await makeRequest(createEventUrl(), 'POST', body);

      if (response.status === 200) {
        const id = response.data.body.id.toString();
        console.log('event ID created = = =- = = = == = = = ', id);
        const event = {
          [id]: images,
        };
        showNotification({message: `Event created with ID: ${id}`});

        if (images.length) {
          const eventsForSync = await AsyncStorage.getItem('eventsForSync');
          if (eventsForSync === null) {
            await AsyncStorage.setItem('eventsForSync', JSON.stringify(event));
          } else {
            const previouEvents = JSON.parse(eventsForSync);
            await AsyncStorage.setItem(
              'eventsForSync',
              JSON.stringify({...previouEvents, ...event}),
            );
          }
        }
        dispatch(getEvents());
        // await AsyncStorage.setItem('currentAddress', JSON.stringify(coords));
        // await AsyncStorage.setItem(
        //   'eventStartTime',
        //   JSON.stringify(startTimeStamp),
        // );
      }

      return response.status;
    } catch (error) {
      showNotification({message: `Event creation failed: NA`});

      return {message: 'Some Error Occured'};
    }
  },
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (data: object) => {
    try {
      const body = {...data};
      const {id} = data;
      const response = await makeRequest(updateEventUrl(id), 'PUT', body);

      return response.data;
    } catch (error) {
      return {error};
    }
  },
);

export const uploadEventPhotos = createAsyncThunk(
  'events/uploadEventPhotos',
  async (data: object, {dispatch}) => {
    try {
      const allEvents = {...data};
      console.log(
        'upload sync data=================-----------=======',
        allEvents,
        typeof allEvents,
      );
      // return {};

      const eventKey = Object.keys(allEvents)[0];
      console.log('event KEY--===============', eventKey);

      const imagesToSync = allEvents[eventKey];
      console.log('imagesToSync --===============', imagesToSync);

      const requests = imagesToSync.map(async (image, index) => {
        const formData = new FormData();
        formData.append('upload', {
          uri: image.uri,
          type: 'image/jpeg',
          name: image.filename,
        });

        console.log('formData===============', eventKey, formData);
        const response = await axios.post(
          `https://2fm3on5exc.execute-api.us-east-1.amazonaws.com/events/upload/${eventKey}`,
          formData,
          {
            timeout: 50000,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('response partial ====== >>>>>>', response);
      });
      const response = await Promise.allSettled(requests);
      console.log('response ALL ++++++++++++++++++++++ ', response);

      delete allEvents[eventKey];
      console.log('allEvents after delete --===============', allEvents);

      console.log('UPLOADEING SUCCESSFULLLL-----------');
      if (Object.keys(allEvents).length) {
        console.log('updating STORAGE============ SUCCESSFULLLL-----------');
        await AsyncStorage.setItem('uploadingSlot', 'available');
        await AsyncStorage.setItem('eventsForSync', JSON.stringify(allEvents));
      } else {
        console.log('REMOVING STORAGE============ SUCCESSFULLLL-----------');
        await AsyncStorage.setItem('uploadingSlot', 'available');
        await AsyncStorage.removeItem('eventsForSync');
      }
      dispatch(getEvents());
      showNotification({message: 'upload image Success'});
      return {status: 200};
    } catch (error) {
      await AsyncStorage.setItem('uploadingSlot', 'available');
      showNotification({message: 'upload image Failed'});
      return {error: 'Upload failed'};
    }
  },
);

export const uploadEventPhotosOld = createAsyncThunk(
  'events/uploadEventPhotos',
  async (data: object, {dispatch}) => {
    try {
      const allEvents = {...data};
      console.log(
        'upload sync data=================-----------=======',
        allEvents,
        typeof allEvents,
      );
      // return {};

      const formData = new FormData();

      const eventKey = Object.keys(allEvents)[0];
      console.log('event KEY--===============', eventKey);

      const imagesToSync = allEvents[eventKey];
      console.log('imagesToSync --===============', imagesToSync);

      imagesToSync.forEach((image, index) => {
        formData.append('upload', {
          uri: image.uri,
          type: 'image/jpeg',
          name: image.filename,
        });
      });

      delete allEvents[eventKey];
      console.log('allEvents after delete --===============', allEvents);

      console.log('formData===============', eventKey, formData);
      const response = await axios.post(
        `https://4134bhgzxj.execute-api.us-east-1.amazonaws.com/events/upload/${eventKey}`,
        formData,
        {
          timeout: 50000,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('response event ====== >>>>>>', response);

      console.log('UPLOADEING SUCCESSFULLLL-----------');
      if (Object.keys(allEvents).length) {
        console.log('updating STORAGE============ SUCCESSFULLLL-----------');
        await AsyncStorage.setItem('uploadingSlot', 'available');
        await AsyncStorage.setItem('eventsForSync', JSON.stringify(allEvents));
      } else {
        console.log('REMOVING STORAGE============ SUCCESSFULLLL-----------');
        await AsyncStorage.setItem('uploadingSlot', 'available');
        await AsyncStorage.removeItem('eventsForSync');
      }
      dispatch(getEvents());
      return {status: 200};
    } catch (error) {
      await AsyncStorage.setItem('uploadingSlot', 'available');
      return {error};
    }
  },
);

export const uploadEventPhotosOlder = createAsyncThunk(
  'events/uploadEventPhotos',
  async (data: object, {dispatch}) => {
    try {
      const eventsForSync = (await AsyncStorage.getItem('eventsForSync')) || '';

      let parsedEvents;
      if (eventsForSync === '') {
        return {};
      }

      parsedEvents = JSON.parse(eventsForSync);

      const keys = Object.keys(parsedEvents);

      const requests = keys.map(async key => {
        console.log('uploding for event ====== ', key);
        const formData = new FormData();

        parsedEvents[key].forEach((image, index) => {
          formData.append(`upload[${index}]`, {
            uri: image.uri,
            type: 'image/jpeg',
            name: image.filename,
          });
        });
        console.log('formData==', key, '=============', formData);
        const response = await axios.post(
          `https://2fm3on5exc.execute-api.us-east-1.amazonaws.com/events/upload/${key}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('partial event ====== ', key, '>>>>>>', response);

        if (response.status === 200) {
          return {id: key, status: response.status};
        }
      });
      const response = await Promise.allSettled(requests);
      console.log('all reposne+++++++++++++++>', response[0].reason);

      if (response.length) {
        await AsyncStorage.removeItem('eventsForSync');
        dispatch(getEvents());
        return {status: 200};
      } else {
        throw new Error();
      }
    } catch (error) {
      return {error};
    }
  },
);

const toastSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    updateEvents: (state, action) => {
      state.events = [...state.events, action.payload];
    },
  },
  extraReducers: builder => {
    builder.addCase(getEvents.pending, state => {
      state.loading = true;
    });
    builder.addCase(getEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.events = action.payload;
    });
    builder.addCase(getEvents.rejected, state => {
      state.loading = false;
      state.error = true;
    });

    builder.addCase(createEvent.pending, state => {
      // state.loading = true;
    });
    builder.addCase(createEvent.fulfilled, state => {
      state.loading = false;
      state.error = false;
    });
    builder.addCase(createEvent.rejected, state => {
      state.loading = false;
      state.error = true;
    });

    builder.addCase(uploadEventPhotos.pending, state => {
      state.uploading = true;
    });
    builder.addCase(uploadEventPhotos.fulfilled, state => {
      state.uploading = false;
      state.uploadError = false;
    });
    builder.addCase(uploadEventPhotos.rejected, state => {
      state.uploading = false;
      state.uploadError = true;
    });
  },
});

export default toastSlice.reducer;
export const {updateEvents} = toastSlice.actions;
