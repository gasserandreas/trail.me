import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ControlsPanel from '../../ui/Panels/ControlsPanel/ControlsPanel';

import {
  enableMultiSelect,
  disableMultiSelect,
  removeWaypoints,
} from '../../entities/route-edit';

import {
  multiSelectSelector,
  selectedWaypointIdsSelector,
  waypointsIdsSelector,
} from '../../entities/route-edit/selector';

const ConnectedCoordinatesPanel = () => {
  const dispatch = useDispatch();

  const selectedWaypointIds = useSelector(selectedWaypointIdsSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);
  const isMultiSelect = useSelector(multiSelectSelector);

  const handleOnCoordinateDelete = () => {
    dispatch(removeWaypoints(selectedWaypointIds));
    dispatch(disableMultiSelect());
  };

  const handleOnCoordinateReset = () => {
    dispatch(disableMultiSelect());
  };

  const handleOnSetMultiSelect = () => {
    dispatch(enableMultiSelect());
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
