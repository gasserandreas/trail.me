import React, { useState, useRef, useMemo } from 'react';

import SwissGeoMap, { FRICK_VIEWPORT } from '../SwissGeoMap';
import Circle from '../circles';

import EXAMPLE_COORDINATES from './coordinates.json';

const DrawLineExample = () => {
  const mapRef = useRef(null);

  const [viewport, setViewport] = useState(FRICK_VIEWPORT);
  const coordinates = EXAMPLE_COORDINATES;

  const onViewportChanged = (newViewport) => {
    setViewport(newViewport);
  };

  const circles = useMemo(() => {
    const { zoom } = viewport;
    return coordinates.map((coordinate) => (
      <Circle zoom={zoom} latlng={coordinate} />
    ));
  }, [coordinates, viewport]);

  return (
    <SwissGeoMap
      ref={mapRef}
      onViewportChanged={onViewportChanged}
      viewport={viewport}
    >
      {circles}
    </SwissGeoMap>
  );
};

export default DrawLineExample;
