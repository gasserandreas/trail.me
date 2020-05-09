import React, { useState } from 'react';

import { FRICK_VIEWPORT } from '../../Map/SwissGeoMap';
import MapPanel from './MapPanel';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/MapPanel',
  component: MapPanel,
  decorators: [ActionPanel],
};

export const SimpleMapPanel = () => {
  const demoLocation = {
    lat: FRICK_VIEWPORT.center[0],
    lng: FRICK_VIEWPORT.center[1],
  };

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
      onCenterChange={handleOnCenterChange}
    />
  );
};
