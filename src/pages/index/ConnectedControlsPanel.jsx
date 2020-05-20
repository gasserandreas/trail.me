import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ControlsPanel from '../../ui/Panels/ControlsPanel/ControlsPanel';

import { removeWaypoints, resetSelectedWaypoints } from '../../entities/waypoints';
import { selectedWaypointIdsSelector, waypointsIdsSelector } from '../../entities/waypoints/selector';

import { setMultiSelect } from '../../entities/map';
import { multiSelectSelector } from '../../entities/map/selector';

const ConnectedCoordinatesPanel = () => {
  const dispatch = useDispatch();

  const selectedWaypointIds = useSelector(selectedWaypointIdsSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);
  const isMultiSelect = useSelector(multiSelectSelector);

  const handleOnCoordinateDelete = () => {
    dispatch(removeWaypoints(selectedWaypointIds));
    dispatch(setMultiSelect(false));
  };

  const handleOnCoordinateReset = () => {
    dispatch(resetSelectedWaypoints());
    dispatch(setMultiSelect(false));
  };

  const handleOnSetMultiSelect = () => {
    dispatch(setMultiSelect(true));
  };

  // don't render with no items
  if (waypointsIds.length === 0) {
    return null;
  }

  return (
    <ControlsPanel
      isMultiSelect={isMultiSelect}
      selectedCoordinates={selectedWaypointIds}
      onCoordinateDelete={handleOnCoordinateDelete}
      onCoordinateReset={handleOnCoordinateReset}
      onSetMultiSelect={handleOnSetMultiSelect}
    />
  );
};

export default ConnectedCoordinatesPanel;
