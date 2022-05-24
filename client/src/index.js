import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import AppContainer from './components/containers/AppContainer';
import theme from './theme';
import { PersistGate } from 'redux-persist/integration/react'

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  </ThemeProvider>,
  document.querySelector('#root'),
);
