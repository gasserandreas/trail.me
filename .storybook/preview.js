import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';

import { addDecorator, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';
import { withKnobs } from '@storybook/addon-knobs';

import { Provider } from 'react-redux';

import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { name } from '../package.json';
import trailMeTheme from '../src/newTheme';

import configureStore from '../src/config/redux/configureStore';
import devInitialReduxStore from '../src/ui/DevUtils/devInitialReduxStore';

import { AppContextProvider } from '../src/config/AppContext';

// import configureStore from '../src/config/redux/configureStore';
// import devInitialReduxStore from '../src/ui/DevUtils/devInitialReduxStore';

const theme = createMuiTheme(trailMeTheme);

addDecorator(withKnobs);

addDecorator((story) => {
  const isDev = true;
  const store = configureStore(devInitialReduxStore);
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
        <Provider store={store}>
          <AppContextProvider isDev={isDev}>
            {story()}
          </AppContextProvider>
        </Provider>
    </ThemeProvider>
  );
});

// set global options
addParameters({
  options: {
    theme: create({
      base: 'light',

      colorPrimary: '#00A578',
      colorSecondary: '#00795B',

      fontBase: '"Arial", sans-serif',

      textColor: '#000000',

      brandTitle: name,
      brandUrl: 'http://go/ui',
      brandImage: './favicon.ico',
    }),
  },
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}