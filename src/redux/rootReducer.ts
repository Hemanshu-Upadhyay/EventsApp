import {combineReducers} from '@reduxjs/toolkit';

import eventsSlice from './slices/eventsSlice';

const createReducer = () =>
  combineReducers({
    events: eventsSlice,
  });

export default createReducer;
