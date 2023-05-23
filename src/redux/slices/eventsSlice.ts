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

const initialState = {
  events: [],
  loading: false,
  error: false,
};

export const getEvents = createAsyncThunk('events/getEvents', async () => {
  try {
    const response = await makeRequest(getEventsUrl());
    return response.data.data;
  } catch (error) {
    return {error};
  }
});

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (data: object, {dispatch}) => {
    try {
      const body = data.body;
      const {coords, startTimeStamp} = data;
      const images = data.images;

      const response = await makeRequest(createEventUrl(), 'POST', body);

      if (response.status === 200) {
        const id = response.data.body.id.toString();
        const event = {
          [id]: images,
        };
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
      const eventsForSync = (await AsyncStorage.getItem('eventsForSync')) || '';

      let parsedEvents;
      if (eventsForSync === '') {
        return {};
      }

      parsedEvents = JSON.parse(eventsForSync);

      const keys = Object.keys(parsedEvents);
      const requests = keys.map(async key => {
        const formData = new FormData();

        parsedEvents[key].forEach(image => {
          formData.append('upload', {
            uri: image.uri,
            type: 'image/jpeg',
            name: image.filename,
          });
        });

        const response = await axios.post(
          `https://h56ja5o9j2.execute-api.us-east-1.amazonaws.com/events/upload/${key}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        return response.status;
      });
      await AsyncStorage.removeItem('eventsForSync');

      const response = await Promise.all(requests);
      // const response = await makeRequest(uploadEventPhotosUrl(id), 'PUT', body);
      // const response = {};
      // return {};
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
      state.loading = true;
    });
    builder.addCase(createEvent.fulfilled, state => {
      state.loading = false;
      state.error = false;
    });
    builder.addCase(createEvent.rejected, state => {
      state.loading = false;
      state.error = true;
    });
  },
});

export default toastSlice.reducer;
export const {updateEvents} = toastSlice.actions;
