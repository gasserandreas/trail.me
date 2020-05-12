import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import WaypointsPanel from '../../ui/Panels/WaypointsPanel/WaypointsPanel';

import { selectWaypoints, deselectWaypoints } from '../../entities/waypoints';
import {
  waypointsByIdSelector,
  waypointsIdsSelector,
  selectedWaypointsSelector,
  waypointsPendingSelector,
} from '../../entities/waypoints/selector';

const ConnectedWaypointsPanel = ({ panelHeight }) => {
  const dispatch = useDispatch();

  const waypointsPending = useSelector(waypointsPendingSelector);
  const waypointsById = useSelector(waypointsByIdSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);
  const selectedWaypoints = useSelector(selectedWaypointsSelector);

  const handleOnWaypointSelect = (_, newSelected) => {
    dispatch(selectWaypoints(newSelected));
  };

  const handleOnWaypointDeSelect = (_, newDeselect) => {
    dispatch(deselectWaypoints(newDeselect));
  };

  return (
    <WaypointsPanel
      waypointById={waypointsById}
      waypointIds={waypointsIds}
      waypointSelectedById={selectedWaypoints}
      onWaypointSelect={handleOnWaypointSelect}
      onWaypointDeSelect={handleOnWaypointDeSelect}
      parentHeight={panelHeight}
      pending={waypointsPending}
    />
  );
};

ConnectedWaypointsPanel.propTypes = {
  panelHeight: PropTypes.number.isRequired,
};

export default ConnectedWaypointsPanel;
