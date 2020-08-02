import React from 'react';

import MapPanel from '.';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/MapPanel',
  component: MapPanel,
  decorators: [ActionPanel],
};

export const SimpleMapPanel = () => <MapPanel />;
