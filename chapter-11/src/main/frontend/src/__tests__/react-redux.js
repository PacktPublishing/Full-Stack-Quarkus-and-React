import React from 'react';
import {ThemeProvider} from '@mui/material';
import {Provider} from 'react-redux';
import {render as testRender} from '@testing-library/react';
import {store} from '../store';
import {theme} from '../styles/theme';

export const render = (ui, options = {}) => {
  const Wrapper = ({children}) =>
    <Provider store={store}><ThemeProvider theme={theme}>{children}</ThemeProvider></Provider>;
  return testRender(ui, {wrapper: Wrapper, ...options});
};
