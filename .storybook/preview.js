import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import { Provider } from 'react-redux';

import { addDecorator, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';
import { withKnobs } from '@storybook/addon-knobs';

import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { name } from '../package.json';
import bikeMeTheme from '../src/theme';

import configureStore from '../src/config/redux/configureStore';
import devInitialReduxStore from '../src/ui/DevUtils/devInitialReduxStore';

const theme = createMuiTheme(bikeMeTheme);

addDecorator(withKnobs);

addDecorator((story) => {
  const store = configureStore(devInitialReduxStore);
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Provider store={store}>
        {story()}
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
