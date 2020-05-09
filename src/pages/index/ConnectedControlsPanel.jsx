import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ControlsPanel from '../../ui/Panels/ControlsPanel/ControlsPanel';

import { removeWaypoints, selectWaypoints } from '../../entities/waypoints';
import { selectedWaypointsSelector } from '../../entities/waypoints/selector';

const ConnectedCoordinatesPanel = () => {
  const dispatch = useDispatch();

  const selectedWaypoints = useSelector(selectedWaypointsSelector);

  const handleOnCoordinateDelete = () => {
    dispatch(removeWaypoints(selectedWaypoints));
  };

  const handleOnCoordinateReset = () => {
    dispatch(selectWaypoints([]));
  };

  return (
    <ControlsPanel
      selectedCoordinates={selectedWaypoints}
      onCoordinateDelete={handleOnCoordinateDelete}
      onCoordinateReset={handleOnCoordinateReset}
    />
  );
};

export default ConnectedCoordinatesPanel;