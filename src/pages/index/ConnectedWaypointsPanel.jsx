import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import WaypointsPanel from '../../ui/Panels/WaypointsPanel/WaypointsPanel';

import { selectWaypoints, deselectWaypoints, setSelectedWaypoints } from '../../entities/waypoints';
import {
  waypointsByIdSelector,
  waypointsIdsSelector,
  selectedWaypointsSelector,
  waypointsPendingSelector,
} from '../../entities/waypoints/selector';

import { setMultiSelect, setViewportCoordinates } from '../../entities/map';
import { multiSelectSelector } from '../../entities/map/selector';

const ConnectedWaypointsPanel = ({ panelHeight }) => {
  const dispatch = useDispatch();

  const waypointsPending = useSelector(waypointsPendingSelector);
  const waypointsById = useSelector(waypointsByIdSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);
  const selectedWaypoints = useSelector(selectedWaypointsSelector);
  const isMultiSelect = useSelector(multiSelectSelector);

  const handleOnWaypointSelect = (_, newSelected) => {
    dispatch(selectWaypoints(newSelected));
  };

  const handleOnWaypointDeSelect = (_, newDeselect) => {
    dispatch(deselectWaypoints(newDeselect));
  };

  const handleOnWaypointSetSelected = (_, id) => {
    dispatch(setSelectedWaypoints([id]));

    const { lat, lng } = waypointsById[id];
    dispatch(setViewportCoordinates([lat, lng]));
  };

  const handleOnSetMultiSelect = () => {
    dispatch(setMultiSelect(true));
  };

  // don't render with no items
  if (waypointsIds.length === 0) {
    return null;
  }

  return (
    <WaypointsPanel
      waypointById={waypointsById}
      waypointIds={waypointsIds}
      waypointSelectedById={selectedWaypoints}
      onWaypointSelect={handleOnWaypointSelect}
      onWaypointDeSelect={handleOnWaypointDeSelect}
      onWaypointSetSelected={handleOnWaypointSetSelected}
      onSetMultiSelect={handleOnSetMultiSelect}
      parentHeight={panelHeight}
      pending={waypointsPending}
      multiSelect={isMultiSelect}
    />
  );
};

ConnectedWaypointsPanel.propTypes = {
  panelHeight: PropTypes.number,
};

ConnectedWaypointsPanel.defaultProps = {
  panelHeight: null,
};

export default ConnectedWaypointsPanel;
