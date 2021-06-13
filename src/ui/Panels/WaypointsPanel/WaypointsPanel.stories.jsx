import React from 'react';

import WaypointsPanel from '.';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/WaypointsPanel',
  component: WaypointsPanel,
  decorators: [ActionPanel],
};

export const SimpleCoordinatesPanel = () => <WaypointsPanel parentHeight={350} />;
