import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Polyline from '../../../ui/Map/Polyline';
import MapActions from '../../../constants/MapActions';

import { removeWaypoints, selectWaypoints, addWaypointBetween } from '../../../entities/waypoints';
import { waypointsPolylinesSelector, waypointsPendingSelector } from '../../../entities/waypoints/selector';

import { setMultiSelect } from '../../../entities/map';
import { viewportSelector, actionTypeSelector, multiSelectSelector } from '../../../entities/map/selector';

const ConnectedPolylines = () => {
  const dispatch = useDispatch();

  const waypointsPending = useSelector(waypointsPendingSelector);
  const polylines = useSelector(waypointsPolylinesSelector);
  const actionType = useSelector(actionTypeSelector);
  const viewport = useSelector(viewportSelector);
  const isMultiSelect = useSelector(multiSelectSelector);
  const { zoom } = viewport;

  if (waypointsPending) {
    return null;
  }

  // polylines code
  const handlePolylineClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    if (actionType === MapActions.REMOVE) {
      dispatch(removeWaypoints([startId, endId]));
      return;
    }

    if (!isMultiSelect) {
      dispatch(setMultiSelect(true));
    }

    dispatch(selectWaypoints([startId, endId]));
  };

  const handlePolylinesDbClick = (e, startId, endId) => {
    e.originalEvent.stopPropagation();

    const { latlng: { lat, lng } } = e;

    const data = { lat, lng };
    dispatch(addWaypointBetween(data, startId, endId));
  };

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

  return polylinesItems;
};

export default ConnectedPolylines;
