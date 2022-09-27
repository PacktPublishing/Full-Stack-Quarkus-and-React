import {createSlice} from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    drawerOpen: true,
  },
  reducers: {
    toggleDrawer: state => {
      state.drawerOpen = !state.drawerOpen;
    }
  }
});

export const {
  toggleDrawer
} = layoutSlice.actions;
export const {reducer} = layoutSlice;
