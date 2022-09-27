import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {reducer as layoutReducer} from './layout';

const appReducer = combineReducers({
  layout: layoutReducer
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer
});
