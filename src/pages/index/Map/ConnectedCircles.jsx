import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Circle from '../../../ui/Map/Circle';
import MapActions from '../../../constants/MapActions';

import {
  removeWaypoints,
  selectWaypoints,
  moveWaypoint,
} from '../../../entities/waypoints';

import {
  waypointsSelector,
  selectedWaypointsSelector,
  waypointsPendingSelector,
} from '../../../entities/waypoints/selector';

import { viewportSelector, actionTypeSelector } from '../../../entities/map/selector';

const ZOOM_HIDE_LEVEL = 14;

const ConnectedCircles = () => {
  const dispatch = useDispatch();

  const actionType = useSelector(actionTypeSelector);
  const waypointsPending = useSelector(waypointsPendingSelector);
  const waypoints = useSelector(waypointsSelector);
  const selectedWaypoints = useSelector(selectedWaypointsSelector);

  const viewport = useSelector(viewportSelector);
  const { zoom } = viewport;

  if (waypointsPending || zoom <= ZOOM_HIDE_LEVEL) {
    return null;
  }

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
    const { target: { _latlng } } = e;
    dispatch(moveWaypoint(id, _latlng));
  };

  const circleItems = waypoints.map(({ id, lat, lng }, i) => (
    <Circle
      key={`waypoint-circle-${i}`}
      latlng={{ lat, lng }}
      zoom={zoom}
      onClick={(e) => handleCircleClick(e, id)}
      onDragend={(e) => handleOnDragend(e, id)}
      selected={selectedWaypoints[id].value}
    />
  ));

  return circleItems;
};

export default ConnectedCircles;