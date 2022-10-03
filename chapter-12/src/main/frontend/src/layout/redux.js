import {createSlice} from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    changePasswordOpen: false,
    drawerOpen: true,
    newProjectOpen: false,
    openTask: undefined
  },
  reducers: {
    openChangePassword: state => {
      state.changePasswordOpen = true;
    },
    closeChangePassword: state => {
      state.changePasswordOpen = false;
    },
    openNewProject: state => {
      state.newProjectOpen = true;
    },
    closeNewProject: state => {
      state.newProjectOpen = false;
    },
    newTask: (state, action={}) => {
      state.openTask = {
        title: '',
        description: '',
        ...action.payload ?? {}
      };
    },
    clearOpenTask: state => {
      state.openTask = undefined;
    },
    setOpenTask: (state, action) => {
      state.openTask = action.payload;
    },
    toggleDrawer: state => {
      state.drawerOpen = !state.drawerOpen;
    }
  }
});

export const {
  openChangePassword, closeChangePassword, openNewProject, closeNewProject, clearOpenTask, newTask, setOpenTask, toggleDrawer
} = layoutSlice.actions;
export const {reducer} = layoutSlice;
