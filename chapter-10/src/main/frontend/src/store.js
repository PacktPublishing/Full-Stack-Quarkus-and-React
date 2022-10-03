import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {logout, reducer as authReducer} from './auth';
import {reducer as layoutReducer} from './layout';
import {api as projectApi} from './projects';
import {api as taskApi} from './tasks';
import {api as userApi} from './users';

const appReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [userApi.reducerPath]: userApi.reducer
});

const rootReducer = (state, action) => {
  if (logout.match(action)) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat(projectApi.middleware)
    .concat(taskApi.middleware)
    .concat(userApi.middleware)
});
