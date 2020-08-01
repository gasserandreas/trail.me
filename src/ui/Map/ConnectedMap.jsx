import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setViewport } from '../../entities/map';
import { viewportSelector } from '../../entities/map/selector';

import {
  addWaypoint,
  addWaypointBetween,
  removeWaypoints,
  moveWaypoint,
  enableMultiSelect,
  selectWaypoints,
  setSelectedWaypoint,
} from '../../entities/route-edit';

import {
  actionTypeSelector,
  multiSelectSelector,
  waypointsSelector,
  waypointsPolylinesSelector,
  metaStateSelector,
} from '../../entities/route-edit/selector';

import SwissGeoMap from './SwissGeoMap';
import Circle from './Circle';
import Polyline from './Polyline';

import MapActions from '../../constants/MapActions';

const ZOOM_HIDE_LEVEL = 14;

const ConnectedMap = () => {
  const dispatch = useDispatch();

  const actionType = useSelector(actionTypeSelector);
  const isMultiSelect = useSelector(multiSelectSelector);

  const polylines = useSelector(waypointsPolylinesSelector);
  const waypoints = useSelector(waypointsSelector);
  const waypointMeta = useSelector(metaStateSelector);

  // handle map viewport
  const viewport = useSelector(viewportSelector);
  const { zoom } = viewport;

  const handleOnViewportChanged = (newViewport) => {
    dispatch(setViewport(newViewport));
  };

  /**
   * circle action handlers
   */
  const handleCircleClick = (e, id) => {
    e.originalEvent.stopPropagation();

    if (actionType === MapActions.REMOVE) {
      dispatch(removeWaypoints([id]));
      return;
    }

    if (isMultiSelect) {
      dispatch(selectWaypoints([id]));
      return;
    }

    dispatch(setSelectedWaypoint(id));
  };

  const handleOnDragend = (e, id) => {
    const { target: { _latlng } } = e;
    dispatch(moveWaypoint(id, _latlng));
  };

  /**
   * polylines action handlers
   */
  const handlePolylineClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    if (actionType === MapActions.REMOVE) {
      dispatch(removeWaypoints([startId, endId]));
      return;
    }

    if (!isMultiSelect) {
      dispatch(enableMultiSelect());
    }

    dispatch(selectWaypoints([startId, endId]));
  };

  const handlePolylinesDbClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    const { latlng: { lat, lng } } = e;

    const data = { lat, lng };
    dispatch(addWaypointBetween(data, startId, endId));
  };

  // map action handlers
  const handleOnMapClick = (e) => {
    const { latlng } = e;

    switch (actionType) {
      case MapActions.ADD:
        dispatch(addWaypoint(latlng));
        break;
      default:
    }
  };

  const circleItems = zoom >= ZOOM_HIDE_LEVEL && waypoints.map(({ id, lat, lng }, i) => (
    <Circle
      key={`waypoint-circle-${i}`}
      latlng={{ lat, lng }}
      zoom={zoom}
      onClick={(e) => handleCircleClick(e, id)}
      onDragend={(e) => handleOnDragend(e, id)}
      selected={waypointMeta[id].selected}
    />
  ));

  const polylinesItems = polylines.map(({
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
      smoothFactor={3}
    />
  ));

  return (
    <SwissGeoMap
      viewport={viewport}
      onViewportChanged={handleOnViewportChanged}
      onClick={handleOnMapClick}
      doubleClickZoom={false}
      mapAction={actionType}
    >
      {polylinesItems}
      {circleItems}
    </SwissGeoMap>
  );
};

export default ConnectedMap;
