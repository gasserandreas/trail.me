import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Circle from './index';

import {
  removeWaypoints,
  moveWaypoint,
  selectWaypoints,
  setSelectedWaypoint,
} from '../../../entities/route-edit';

import {
  actionTypeSelector,
  multiSelectSelector,
  waypointsByIdSelector,
  metaStateSelector,
} from '../../../entities/route-edit/selectors';

import MapActions from '../../../constants/MapActions';

const Connected = ({ id }) => {
  const dispatch = useDispatch();

  const waypointsById = useSelector(waypointsByIdSelector);
  const waypointMeta = useSelector(metaStateSelector);
  const actionType = useSelector(actionTypeSelector);
  const isMultiSelect = useSelector(multiSelectSelector);

  const waypoint = waypointsById[id];
  const { selected, disabled } = waypointMeta[id];

  if (!waypoint) {
    return null;
  }

  const { lat, lng } = waypoint;

  /**
   * circle action handlers
   */
  const handleCircleClick = (e) => {
    e.originalEvent.stopPropagation();

    if (disabled) {
      return;
    }

    if (actionType === MapActions.REMOVE) {
      dispatch(removeWaypoints([id]));
      return;
    }

    if (isMultiSelect) {
      dispatch(selectWaypoints([id]));
      return;
    }

    dispatch(setSelectedWaypoint(id));
  };

  const handleOnDragend = (e) => {
    if (disabled) {
      return;
    }

    const {
      target: { _latlng: latlng },
    } = e;
    dispatch(moveWaypoint(id, latlng));
  };

  const eventHandlers = {
    click: handleCircleClick,
    dragend: handleOnDragend,
  };

  return (
    <Circle
      latlng={{ lat, lng }}
      eventHandlers={eventHandlers}
      selected={selected}
      disabled={disabled}
    />
  );
};

Connected.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Connected;
