import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import AppContainer from './components/containers/AppContainer';
import theme from './theme';
import { PersistGate } from 'redux-persist/integration/react'
import ProvideAuthContainer from './components/containers/ProvideAuthContainer';

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store'

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ProvideAuthContainer>
            <AppContainer />
          </ProvideAuthContainer>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.querySelector('#root'),
);
