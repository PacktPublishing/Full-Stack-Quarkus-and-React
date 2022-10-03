import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

export const login = createAsyncThunk(
  'auth/login',
  async ({name, password}, thunkAPI) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, password}),
    });
    if (!response.ok) {
      return thunkAPI.rejectWithValue({
        status: response.status, statusText: response.statusText, data: response.data});
    }
    return response.text();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    jwt: sessionStorage.getItem('jwt')
  },
  reducers: {
    logout: state => {
      sessionStorage.removeItem("jwt");
      state.jwt = null;
    }
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      sessionStorage.setItem('jwt', action.payload);
      state.jwt = action.payload;
    }
  }
});

export const {logout} = authSlice.actions;
export const {reducer} = authSlice;

export const authBaseQuery = ({path}) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/${path}`,
    prepareHeaders: (headers, {getState}) => {
      headers.set('authorization', `Bearer ${getState().auth.jwt}`);
      return headers;
    }
  });
  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
    }
    return result;
  };
};

