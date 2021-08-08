import React from 'react';

import { Meta } from '@storybook/react';

import ControlsPanel from '.';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/ControlsPanel',
  component: ControlsPanel,
  decorators: [ActionPanel],
} as Meta;

export const SimpleFilePanel = () => <ControlsPanel />;
