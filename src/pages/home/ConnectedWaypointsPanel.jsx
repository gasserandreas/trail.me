import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import WaypointsPanel from '../../ui/Panels/WaypointsPanel/WaypointsPanel';

import { setViewportCoordinates } from '../../entities/map';

import {
  enableMultiSelect,
  selectWaypoints,
  deSelectWaypoints,
  setSelectedWaypoint,
} from '../../entities/route-edit';

import {
  multiSelectSelector,
  waypointsByIdSelector,
  waypointsIdsSelector,
  metaStateSelector,
  waypointsPendingSelector,
} from '../../entities/route-edit/selector';

const ConnectedWaypointsPanel = ({ panelHeight }) => {
  const dispatch = useDispatch();

  const waypointsPending = useSelector(waypointsPendingSelector);
  const waypointsById = useSelector(waypointsByIdSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);
  const waypointMeta = useSelector(metaStateSelector);

  const isMultiSelect = useSelector(multiSelectSelector);

  const handleOnWaypointSelect = (_, newSelected) => {
    dispatch(selectWaypoints(newSelected));
  };

  const handleOnWaypointDeSelect = (_, newDeselect) => {
    dispatch(deSelectWaypoints(newDeselect));
  };

  const handleOnWaypointSetSelected = (_, id) => {
    dispatch(setSelectedWaypoint([id]));

    const { lat, lng } = waypointsById[id];
    dispatch(setViewportCoordinates([lat, lng]));
  };

  const handleOnSetMultiSelect = () => {
    dispatch(enableMultiSelect());
  };

  const handleOnWaypointDelete = (_, id) => {
    console.log('handleOnWaypointDelete'); // eslint-disable-line no-console
    console.log(id); // eslint-disable-line no-console
  };

  const handleOnWaypointSplit = (_, id) => {
    console.log('handleOnWaypointSplit'); // eslint-disable-line no-console
    console.log(id); // eslint-disable-line no-console
  };


  // don't render with no items
  if (waypointsIds.length === 0) {
    return null;
  }

  return (
    <WaypointsPanel
      waypointById={waypointsById}
      waypointIds={waypointsIds}
      waypointMeta={waypointMeta}
      onWaypointSelect={handleOnWaypointSelect}
      onWaypointDeSelect={handleOnWaypointDeSelect}
      onWaypointSetSelected={handleOnWaypointSetSelected}
      onSetMultiSelect={handleOnSetMultiSelect}
      onWaypointDelete={handleOnWaypointDelete}
      onWaypointSplit={handleOnWaypointSplit}
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
