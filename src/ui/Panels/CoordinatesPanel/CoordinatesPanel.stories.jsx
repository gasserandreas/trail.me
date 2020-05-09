import React from 'react';
import { action } from '@storybook/addon-actions';

import CoordinatesPanel from './CoordinatesPanel';
import { ActionPanel } from '../util';

import coordinates from './__data__/coordinates.json';

export default {
  title: 'Panels/CoordinatesPanel',
  component: CoordinatesPanel,
  decorators: [ActionPanel],
};

export const SimpleCoordinatesPanel = () => (
  <CoordinatesPanel
    coordinates={coordinates}
    selectedCoordinates={[
      '4f72ec93-d59c-4084-8822-01e78ce38a84',
      'c4cd3414-fa91-48dd-a814-080e9f1c4802',
      '3023a7b8-f6f4-40a5-8730-0a4ab1f2caca',
    ]}
    onCoordinateSelect={action('onCoordinateSelect')}
    onCoordinateDeSelect={action('onCoordinateDeSelect')}
    style={{ height: '350px' }}
  />
);
