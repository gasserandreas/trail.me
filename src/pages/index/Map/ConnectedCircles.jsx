import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Circle from '../../../ui/Map/Circle';
import MapActions from '../../../constants/MapActions';

import {
  removeWaypoints,
  selectWaypoints,
  moveWaypoint,
  setSelectedWaypoints,
} from '../../../entities/waypoints';

import {
  waypointsSelector,
  selectedWaypointsSelector,
  waypointsPendingSelector,
} from '../../../entities/waypoints/selector';

import { viewportSelector } from '../../../entities/map/selector';
import { actionTypeSelector, multiSelectSelector } from '../../../entities/route-edit/selector';

const ZOOM_HIDE_LEVEL = 14;

const ConnectedCircles = () => {
  const dispatch = useDispatch();

  const actionType = useSelector(actionTypeSelector);
  const waypointsPending = useSelector(waypointsPendingSelector);
  const waypoints = useSelector(waypointsSelector);
  const selectedWaypoints = useSelector(selectedWaypointsSelector);
  const isMultiSelect = useSelector(multiSelectSelector);

  const viewport = useSelector(viewportSelector);
  const { zoom } = viewport;

  if (waypointsPending || zoom <= ZOOM_HIDE_LEVEL) {
    return null;
  }

  // circle code
  const handleCircleClick = (e, id) => {
    e.originalEvent.stopPropagation();
    const ids = [id];

    if (actionType === MapActions.REMOVE) {
      dispatch(removeWaypoints(ids));
      return;
    }

    if (isMultiSelect) {
      dispatch(selectWaypoints(ids));
      return;
    }

    dispatch(setSelectedWaypoints(ids));
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
