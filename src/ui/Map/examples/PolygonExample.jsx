import React, { useState, useRef, useMemo } from 'react';
import { Polyline } from 'react-leaflet';

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

  const polylines = useMemo(() => {
    if (coordinates.length === 0) return [];
    if (coordinates.length === 1) return [];

    const newPolylines = [];
    let lastCoorindate = null;
    coordinates.forEach((coordinate, i) => {
      if (lastCoorindate) {
        // TODO: create polyline
        const polyline = (
          <Polyline
            key={`polyline_${i}`}
            positions={[
              [lastCoorindate.lat, lastCoorindate.lng],
              [coordinate.lat, coordinate.lng],
            ]}
          />
        );
        newPolylines.push(polyline);
      }

      lastCoorindate = coordinate;
    });

    return newPolylines;
  }, [coordinates]);

  return (
    <SwissGeoMap
      ref={mapRef}
      onViewportChanged={onViewportChanged}
      viewport={viewport}
    >
      {circles}
      {polylines}
    </SwissGeoMap>
  );
};

export default DrawLineExample;
