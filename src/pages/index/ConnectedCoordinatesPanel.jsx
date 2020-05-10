import React from 'react';
// import { useDispatch } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import difference from 'lodash/difference';

import CoordinatesPanel from '../../ui/Panels/CoordinatesPanel/CoordinatesPanel';

import { selectWaypoints } from '../../entities/waypoints';
import { waypointsSelector, selectedWaypointIdsSelector } from '../../entities/waypoints/selector';

const ConnectedCoordinatesPanel = () => {
  const dispatch = useDispatch();

  const waypoints = useSelector(waypointsSelector);
  const selectedWaypointIds = useSelector(selectedWaypointIdsSelector);

  // const handleOnCoordinateSelect = () => {
  const handleOnCoordinateSelect = (_, newSelected) => {
    const newSelectedWaypoints = [...new Set([...selectedWaypointIds, ...newSelected])];
    dispatch(selectWaypoints(newSelectedWaypoints));
  };

  // const handleOnCoordinateDeSelect = () => {
  const handleOnCoordinateDeSelect = (_, newDeselect) => {
    const newSelectedWaypoints = difference(selectedWaypointIds, newDeselect);
    dispatch(selectWaypoints(newSelectedWaypoints));
  };


  return (
    <CoordinatesPanel
      coordinates={waypoints}
      selectedCoordinates={selectedWaypointIds}
      onCoordinateSelect={handleOnCoordinateSelect}
      onCoordinateDeSelect={handleOnCoordinateDeSelect}
    />
  );
};

export default ConnectedCoordinatesPanel;
