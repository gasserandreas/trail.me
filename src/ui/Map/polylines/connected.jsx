import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Polyline from './index';

import MapActions from '../../../constants/MapActions';

import {
  enableMultiSelect,
  selectWaypoints,
  removeWaypoints,
  addWaypointBetween,
} from '../../../entities/route-edit';

import {
  actionTypeSelector,
  multiSelectSelector,
  metaStateSelector,
  waypointsPolylinesByIdSelector,
} from '../../../entities/route-edit/selectors';

const Connected = ({ id }) => {
  const dispatch = useDispatch();

  const actionType = useSelector(actionTypeSelector);
  const isMultiSelect = useSelector(multiSelectSelector);
  const polylinesById = useSelector(waypointsPolylinesByIdSelector);
  const waypointMeta = useSelector(metaStateSelector);

  const polyline = polylinesById[id];

  if (!polyline) {
    return null;
  }

  const { startWaypointId, endWaypointId, startPosition, endPosition, selected, disabled } =
    polyline;

  const handlePolylineClick = (e) => {
    e.originalEvent.stopPropagation();

    if (actionType === MapActions.REMOVE) {
      if (!waypointMeta[startWaypointId].disabled) {
        dispatch(removeWaypoints([startWaypointId]));
      }

      if (!waypointMeta[startWaypointId].disabled) {
        dispatch(removeWaypoints([endWaypointId]));
      }
      return;
    }

    if (!isMultiSelect) {
      dispatch(enableMultiSelect());
    }

    dispatch(selectWaypoints([startWaypointId, endWaypointId]));
  };

  const handlePolylinesDbClick = (e) => {
    e.originalEvent.stopPropagation();

    if (waypointMeta[endWaypointId].disabled) {
      return;
    }

    const {
      latlng: { lat, lng },
    } = e;

    const data = { lat, lng };
    dispatch(addWaypointBetween(data, startWaypointId, endWaypointId));
  };

  const eventHandlers = {
    click: handlePolylineClick,
    dblclick: handlePolylinesDbClick,
  };

  return (
    <Polyline
      eventHandlers={eventHandlers}
      startLatlng={startPosition}
      endLatlng={endPosition}
      selected={selected}
      disabled={disabled}
      smoothFactor={3}
    />
  );
};

Connected.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Connected;
