import React from 'react';
import { action } from '@storybook/addon-actions';

import WaypointsPanel from './WaypointsPanel';
import { ActionPanel } from '../util';

import waypoints from './__data__/waypoints.json';

/**
 * Calculate demo data
 */
const byId = {};
const ids = [];
const selected = {};

waypoints.forEach((waypoint) => {
  const { id } = waypoint;
  byId[id] = waypoint;
  ids.push(id);
  selected[id] = {
    value: id === '4f72ec93-d59c-4084-8822-01e78ce38a84' || id === 'c4cd3414-fa91-48dd-a814-080e9f1c4802',
  };
});

export default {
  title: 'Panels/WaypointsPanel',
  component: WaypointsPanel,
  decorators: [ActionPanel],
};

export const SimpleCoordinatesPanel = () => (
  <WaypointsPanel
    waypointById={byId}
    waypointIds={ids}
    waypointSelectedById={selected}
    onWaypointSelect={action('onWaypointSelect')}
    onWaypointDeSelect={action('onWaypointDeSelect')}
    style={{ height: '350px' }}
  />
);
