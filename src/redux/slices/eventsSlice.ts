import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  events: [],
  loading: false,
  error: null,
};

const toastSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    updateEvents: (state, action) => {
      state.events = [...state.events, action.payload];
    },
  },
});

export default toastSlice.reducer;
export const {updateEvents} = toastSlice.actions;
