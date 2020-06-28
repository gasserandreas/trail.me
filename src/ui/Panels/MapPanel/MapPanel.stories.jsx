import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';

import { FRICK_VIEWPORT } from '../../Map/SwissGeoMap';
import MapPanel from './MapPanel';
import { ActionPanel } from '../util';
import MapActions from '../../../constants/MapActions';

export default {
  title: 'Panels/MapPanel',
  component: MapPanel,
  decorators: [ActionPanel],
};

export const SimpleMapPanel = () => {
  const demoLocation = [FRICK_VIEWPORT.center[0], FRICK_VIEWPORT.center[1]];

  const [viewport, setViewport] = useState({
    center: demoLocation,
    zoom: 13,
  });

  const handleOnCenterChange = (_, newCenter) => {
    const newViewport = {
      ...viewport,
      center: newCenter,
    };
    setViewport(newViewport);
  };

  return (
    <MapPanel
      center={viewport.center}
      mapAction={select('mapAction', MapActions, MapActions.SELECT)}
      onCenterChange={handleOnCenterChange}
      onMapActionChange={action('onMapActionChange')}
      onLocationUpdate={action('onLocationUpdate')}
      onCustomActionClick={action('onCustomActionClick')}
    />
  );
};
