import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { v5 } from 'uuid';

/**
 * utils functions
 */
function createWaypoints(waypoints = []) {
  const byId = {};
  const ids = [];

  waypoints.forEach((waypoint) => {
    const id = v5();
    byId[id] = waypoint;
    ids.push(id);
  });

  return {
    byId,
    ids,
  };
}

export const initNewRoute = createAction('route/init', () => ({
  id: v5(),
  name: 'new route',
  waypoints: createWaypoints(),
}));

/**
 * byId redux tree
 */
const byIdReducer = createReducer({}, {
  [initNewRoute]: (state, payload) => ({
    ...state,
    [payload.id]: payload,
  }),
});

/**
* ids redux tree
*/
const idsReducer = createReducer([], {
  [initNewRoute]: (state, payload) => [...state, payload.id],
});

export default combineReducers({
  byId: byIdReducer,
  ids: idsReducer,
});

export const __testables__ = {
  createWaypoints,
};
