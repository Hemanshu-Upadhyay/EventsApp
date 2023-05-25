import {configureStore} from '@reduxjs/toolkit';

import createReducer from './rootReducer';

const middlewares = [];

const {logger} = require(`redux-logger`);

// middlewares.push(logger);

const store = configureStore({
  reducer: createReducer(),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(middlewares),
  devTools: true,
});

export default store;
