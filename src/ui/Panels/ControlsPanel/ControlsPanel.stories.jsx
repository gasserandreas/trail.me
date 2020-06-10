import React from 'react';
import { array } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ControlsPanel from './ControlsPanel';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/ControlsPanel',
  component: ControlsPanel,
  decorators: [ActionPanel],
};

export const SimpleFilePanel = () => (
  <ControlsPanel
    selectedCoordinates={array('selectedCoordinates', [
      '4f72ec93-d59c-4084-8822-01e78ce38a84',
      'c4cd3414-fa91-48dd-a814-080e9f1c4802',
      '3023a7b8-f6f4-40a5-8730-0a4ab1f2caca',
    ])}
    onCoordinateDelete={action('onCoordinateDelete')}
    onCoordinateReset={action('onCoordinateReset')}
    onSetMultiSelect={action('onSetMultiSelect')}
  />
);
