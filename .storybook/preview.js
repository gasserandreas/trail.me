import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';
import { withKnobs } from '@storybook/addon-knobs';

import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { name } from '../package.json';

const theme = createMuiTheme({});

addDecorator(withKnobs);

addDecorator((story) => (
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {story()}
  </ThemeProvider>
));

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
