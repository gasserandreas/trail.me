/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';

import configureStore from './config/redux/configureStore';
import bikeMeTheme from './theme';
import { AppContextProvider } from './config/AppContext';
import devInitialReduxStore from './ui/DevUtils/devInitialReduxStore';

const theme = createMuiTheme(bikeMeTheme);

const isDev = process.env.NODE_ENV === 'development';

let initialStore = {};

if (isDev) {
  console.log(theme); // eslint-disable-line no-console
  console.log('--- Init dev initial Redux store ---'); // eslint-disable-line no-console
  initialStore = devInitialReduxStore;
}

// create store object
const store = configureStore(initialStore);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppContextProvider isDev={isDev}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppContextProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
