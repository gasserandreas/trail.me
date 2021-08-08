import React from 'react';

import { Meta } from '@storybook/react';

import FilePanel from '.';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/FilePanel',
  component: FilePanel,
  decorators: [ActionPanel],
} as Meta;

export const SimpleFilePanel = () => <FilePanel />;
