import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { waypointsSelector, waypointsPolylinesSelector } from '../../entities/waypoints/selector';

import { setViewport } from '../../entities/map';
import { viewportSelector } from '../../entities/map/selector';

import SwissGeoMap from '../../ui/Map/SwissGeoMap';
import Circle from '../../ui/Map/Circle';
import Polyline from '../../ui/Map/Polyline';

const ConnectedMap = () => {
  const dispatch = useDispatch();

  // handle map viewport
  const viewport = useSelector(viewportSelector);
  const { zoom } = viewport;
  const handleOnViewportChanged = (newViewport) => {
    dispatch(setViewport(newViewport));
  };

  // handle waypoints
  const waypoints = useSelector(waypointsSelector);
  const polylines = useSelector(waypointsPolylinesSelector);

  // circle code
  const handleCircleClick = (e, id) => {
    e.originalEvent.stopPropagation();

    console.log('handleCircleClick'); // eslint-disable-line no-console
    console.log(id); // eslint-disable-line no-console
  };

  const circleItems = useMemo(() => waypoints.map(({ id, lat, lng }, i) => (
    <Circle
      key={`waypoint-circle-${i}`}
      latlng={{ lat, lng }}
      zoom={zoom}
      onClick={(e) => handleCircleClick(e, id)}
    />
    )), [waypoints, zoom]); // eslint-disable-line

  // polylines code
  const handlePolylineClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    console.log('handlePolylineClick'); // eslint-disable-line no-console
    console.log(startId); // eslint-disable-line no-console
    console.log(endId); // eslint-disable-line no-console
  };

  const polylinesItems = useMemo(() => polylines.map(({
    startCoordinateId,
    endCoordinateId,
    startPosition,
    endPosition,
    selected,
  }, i) => (
    <Polyline
      key={`waypoint-polyline-${i}`}
      onClick={(e) => handlePolylineClick(e, startCoordinateId, endCoordinateId)}
      startLatlng={startPosition}
      endLatlng={endPosition}
      zoom={zoom}
      selected={selected}
    />
  )), [polylines, zoom]);

  return (
    <SwissGeoMap
      onViewportChanged={handleOnViewportChanged}
      viewport={viewport}
    >
      {polylinesItems}
      {circleItems}
    </SwissGeoMap>
  );
};

export default ConnectedMap;
