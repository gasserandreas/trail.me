import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

import { getDistanceForPoint, getPrevWaypoint } from './utils';

import { waypointsByIdSelector, waypointsIdsSelector } from '../waypoints/selector';

// action types
const SET_PENDING = 'analytics/setPending';
const SET_STATS = 'analytics/setStats';
const RESET = 'analytics/reset';

// simple actions
const setPending = createAction(SET_PENDING);
const setStats = createAction(SET_STATS);
const reset = createAction(RESET);

// complex actions
export const resetStats = () => (dispatch) => {
  dispatch(reset());
};

export const calculateStats = () => (dispatch, getStore) => {
  dispatch(setPending(true));

  const store = getStore();
  const waypointsById = waypointsByIdSelector(store);
  const waypointsIds = waypointsIdsSelector(store);

  const prevDistance = {};

  waypointsIds.forEach((waypointId, index) => {
    const waypoint = waypointsById[waypointId];
    const prevWaypoint = getPrevWaypoint(waypointsById, waypointsIds, index);

    const distance = getDistanceForPoint(prevWaypoint, waypoint);

    prevDistance[waypointId] = distance;
  });

  dispatch(setStats({
    prevDistance,
  }));

  dispatch(setPending(false));
};

// reducers
const pendingReducer = (state = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_PENDING:
      return payload;
    default:
      return state;
  }
};

const prevDistanceReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_STATS:
      return {
        ...state,
        ...payload.prevDistance,
      };
    case RESET:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  pending: pendingReducer,
  prevDistance: prevDistanceReducer,
});
