import React, {
  useState, useEffect, useRef, useMemo
} from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';

import SwissGeoMap, { FRICK_VIEWPORT } from '../SwissGeoMap';
import Circle from '../circles';

const INITIAL_LOCATION_STATE = {
  hasLocation: false,
  latlng: {
    lat: null,
    lng: null,
  },
};

const DrawLineExample = () => {
  const mapRef = useRef(null);

  const [viewport, setViewport] = useState(FRICK_VIEWPORT);
  const [locationState, setLocationState] = useState(INITIAL_LOCATION_STATE);
  const [coordinates, setCoordinates] = useState([]);

  // locate your location
  useEffect(() => {
    const map = mapRef.current;
    if (map != null) {
      map.leafletElement.locate();
    }
  }, []);

  const onViewportChanged = (newViewport) => {
    setViewport(newViewport);
  };

  const handleClick = (e) => {
    const { latlng } = e;
    setCoordinates((prev) => [...prev, latlng]);
  };

  const handleLocationFound = (e) => {
    setLocationState({
      hasLocation: true,
      latlng: e.latlng,
    });
  };

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

  const circles = useMemo(() => {
    const { zoom } = viewport;
    return coordinates.map((coordinate) => (
      <Circle zoom={zoom} latlng={coordinate} />
    ));
  }, [coordinates, viewport]);

  const marker = locationState.hasLocation ? (
    <Marker position={locationState.latlng}>
      <Popup>You clicked here</Popup>
    </Marker>
  ) : null;

  return (
    <SwissGeoMap
      onClick={handleClick}
      onLocationfound={handleLocationFound}
      ref={mapRef}
      onViewportChanged={onViewportChanged}
      viewport={viewport}
    >
      {marker}
      {polylines}
      {circles}
    </SwissGeoMap>
  );
};

export default DrawLineExample;
