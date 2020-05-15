import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ControlsPanel from '../../ui/Panels/ControlsPanel/ControlsPanel';

import { removeWaypoints, resetSelectedWaypoints } from '../../entities/waypoints';
import { selectedWaypointIdsSelector, waypointsIdsSelector } from '../../entities/waypoints/selector';

const ConnectedCoordinatesPanel = () => {
  const dispatch = useDispatch();

  const selectedWaypointIds = useSelector(selectedWaypointIdsSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);

  const handleOnCoordinateDelete = () => {
    dispatch(removeWaypoints(selectedWaypointIds));
  };

  const handleOnCoordinateReset = () => {
    dispatch(resetSelectedWaypoints());
  };

  // don't render with no items
  if (waypointsIds.length === 0) {
    return null;
  }

  return (
    <ControlsPanel
      selectedCoordinates={selectedWaypointIds}
      onCoordinateDelete={handleOnCoordinateDelete}
      onCoordinateReset={handleOnCoordinateReset}
    />
  );
};

export default ConnectedCoordinatesPanel;
