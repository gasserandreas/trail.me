import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import difference from 'lodash/difference';

import CoordinatesPanel from '../../ui/Panels/CoordinatesPanel/CoordinatesPanel';

import { selectWaypoints } from '../../entities/waypoints';
import { waypointsSelector, selectedWaypointsSelector } from '../../entities/waypoints/selector';

const ConnectedCoordinatesPanel = () => {
  const dispatch = useDispatch();

  const waypoints = useSelector(waypointsSelector);
  const selectedWaypoints = useSelector(selectedWaypointsSelector);

  const handleOnCoordinateSelect = (_, newSelected) => {
    const newSelectedWaypoints = [...new Set([...selectedWaypoints, ...newSelected])];
    dispatch(selectWaypoints(newSelectedWaypoints));
  };

  const handleOnCoordinateDeSelect = (_, newDeselect) => {
    const newSelectedWaypoints = difference(selectedWaypoints, newDeselect);
    dispatch(selectWaypoints(newSelectedWaypoints));
  };


  return (
    <CoordinatesPanel
      coordinates={waypoints}
      selectedCoordinates={selectedWaypoints}
      onCoordinateSelect={handleOnCoordinateSelect}
      onCoordinateDeSelect={handleOnCoordinateDeSelect}
    />
  );
};

export default ConnectedCoordinatesPanel;
