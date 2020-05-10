import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addWaypoint,
  removeWaypoints,
  selectWaypoints,
  addWaypointBetween,
  moveWaypoint,
} from '../../entities/waypoints';

import {
  waypointsSelector,
  selectedWaypointsSelector,
  waypointsPolylinesSelector,
} from '../../entities/waypoints/selector';

import { setViewport } from '../../entities/map';
import { viewportSelector, actionTypeSelector } from '../../entities/map/selector';

import SwissGeoMap from '../../ui/Map/SwissGeoMap';
import Circle from '../../ui/Map/Circle';
import Polyline from '../../ui/Map/Polyline';

import MapActions from '../../constants/MapActions';
import useSelectedCoordinatesMap from '../../hooks/useSelectedCoordinatesMap';

const ConnectedMap = () => {
  const dispatch = useDispatch();
  const actionType = useSelector(actionTypeSelector);

  // handle map viewport
  const viewport = useSelector(viewportSelector);
  const { zoom } = viewport;
  const handleOnViewportChanged = (newViewport) => {
    dispatch(setViewport(newViewport));
  };

  // handle waypoints
  const waypoints = useSelector(waypointsSelector);
  const selectedWaypoints = useSelector(selectedWaypointsSelector);

  const selectedCoordinatesMap = useSelectedCoordinatesMap(waypoints, selectedWaypoints);
  const polylines = useSelector(waypointsPolylinesSelector);

  // map action handlers
  const handleMapClick = (e) => {
    const { latlng } = e;

    switch (actionType) {
      case MapActions.ADD:
        dispatch(addWaypoint(latlng));
        break;
      default:
    }
  };

  // circle code
  const handleCircleClick = (e, id) => {
    e.originalEvent.stopPropagation();
    const ids = [id];

    switch (actionType) {
      case MapActions.REMOVE:
        dispatch(removeWaypoints(ids));
        break;
      default:
        dispatch(selectWaypoints(ids));
    }
  };

  const handleOnDragend = (e, id) => {
    e.originalEvent.stopPropagation();

    const { target: { _latlng } } = e;
    dispatch(moveWaypoint(id, _latlng));
  };

  const circleItems = useMemo(() => waypoints.map(({ id, lat, lng }, i) => (
    <Circle
      key={`waypoint-circle-${i}`}
      latlng={{ lat, lng }}
      zoom={zoom}
      onClick={(e) => handleCircleClick(e, id)}
      onDragend={(e) => handleOnDragend(e, id)}
      selected={selectedCoordinatesMap[id]}
    />
    )), [waypoints, zoom, actionType]); // eslint-disable-line

  // polylines code
  const handlePolylineClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    switch (actionType) {
      case MapActions.REMOVE:
        dispatch(removeWaypoints([startId, endId]));
        break;
      default:
        dispatch(selectWaypoints([startId, endId]));
    }
  };

  const handlePolylinesDbClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    const { latlng: { lat, lng } } = e;

    const data = { lat, lng };
    dispatch(addWaypointBetween(data, startId, endId));
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
      onDblClick={(e) => handlePolylinesDbClick(e, startCoordinateId, endCoordinateId)}
      startLatlng={startPosition}
      endLatlng={endPosition}
      zoom={zoom}
      selected={selected}
    />
  )), [polylines, zoom, actionType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SwissGeoMap
      viewport={viewport}
      onViewportChanged={handleOnViewportChanged}
      onClick={handleMapClick}
      doubleClickZoom={false}
    >
      {polylinesItems}
      {circleItems}
    </SwissGeoMap>
  );
};

export default ConnectedMap;
