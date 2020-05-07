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

  const [center, setCenter] = useState(demoLocation);

  return (
    <MapPanel
      // zoom={zoom}
      center={center}
      // yourLocation={location}
      // onZoomChange={(_, newZoom) => setZoom(newZoom)}
      onCenterChange={(_, newCenter) => setCenter(newCenter)}
      // onLocationRequest={(_, newLocation) => setLocation(newLocation)}
    />
  );
};
