import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { getDistanceForPoint, getPrevWaypoint } from './utils';

import {
  waypointsByIdSelector,
  waypointsIdsSelector,
} from '../waypoints/selector';

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
  const height = {
    up: null,
    down: null,
  };
  const waypointTime = {
    start: null,
    end: null,
    total: null,
  };

  let valideHeight = true;
  let validTime = true;

  waypointsIds.forEach((waypointId, index) => {
    const waypoint = waypointsById[waypointId];
    const { elevation, time } = waypoint;
    const prevWaypoint = getPrevWaypoint(waypointsById, waypointsIds, index);

    const distance = getDistanceForPoint(prevWaypoint, waypoint);

    prevDistance[waypointId] = distance;

    // check if elevation is set
    valideHeight = valideHeight && elevation;

    // check if time is set
    validTime = validTime && time;
  });

  if (valideHeight) {
    // calculate tour elevation
    let previousWaypoint = null;
    waypointsIds.forEach((waypointId) => {
      const waypoint = waypointsById[waypointId];

      // calculate elevation difference
      if (previousWaypoint) {
        const { elevation } = waypoint;
        const { elevation: prevElevation } = previousWaypoint;

        if (elevation > prevElevation) {
          height.up += elevation - prevElevation;
        } else {
          height.down += prevElevation - elevation;
        }
      }

      previousWaypoint = waypoint;
    });
  }

  if (validTime) {
    const firstWaypoint = waypointsById[waypointsIds[0]];
    const lastWaypoint = waypointsById[waypointsIds[waypointsIds.length - 1]];

    waypointTime.start = firstWaypoint ? firstWaypoint.time : null;
    waypointTime.end = lastWaypoint ? lastWaypoint.time : null;

    let previousWaypoint = null;
    waypointsIds.forEach((waypointId) => {
      const waypoint = waypointsById[waypointId];

      // calculate elevation difference
      if (previousWaypoint) {
        const time = moment(waypoint.time);
        const prevTime = moment(previousWaypoint.time);

        const diff = prevTime.diff(time);
        waypointTime.total += diff;
      }

      previousWaypoint = moment(waypoint);
    });
  }

  dispatch(setStats({
    prevDistance,
    height,
    time: waypointTime,
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
      return payload.prevDistance;
    case RESET:
      return {};
    default:
      return state;
  }
};

const heightReducer = (state = {
  up: null,
  down: null,
}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_STATS:
      return payload.height;
    case RESET:
      return {};
    default:
      return state;
  }
};

const timeReducer = (state = {
  start: null,
  end: null,
  total: null,
}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_STATS:
      return payload.time;
    case RESET:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  pending: pendingReducer,
  prevDistance: prevDistanceReducer,
  height: heightReducer,
  time: timeReducer,
});
