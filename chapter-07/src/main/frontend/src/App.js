import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {InitialPage} from './InitialPage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Navigate to='/initial-page' />} />
      <Route exact path='/initial-page' element={<InitialPage />} />
    </Routes>
  </BrowserRouter>
);
