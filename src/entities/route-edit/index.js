/* eslint-disable no-param-reassign */
import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

import difference from 'lodash/difference';

import MapActions from '../../constants/MapActions';

import { createWaypoint, createWaypoints, createMetaObject } from './utils';

/**
 * action type redux
 */
export const setActionType = createAction('route-edit/setActionType');
const actionTypeReducer = createReducer(MapActions.SELECT, {
  [setActionType]: (_, action) => action.payload,
});

/**
 * multi select redux
 */
export const enableMultiSelect = createAction('route-edit/enableMultiSelect');
export const disableMultiSelect = createAction('route-edit/disableMultiSelect');

const multiSelectReducer = createReducer(false, {
  [enableMultiSelect]: () => true,
  [disableMultiSelect]: () => false,
});

/**
 * internal redux action ONLY
 */
export const initRoute = createAction('route-edit/initNew', (name, waypoints) => ({
  payload: {
    id: uuid.v4(),
    name: name || 'new route',
    waypoints: createWaypoints(waypoints),
  },
}));

const add = createAction('route-edit/add');
const addBetween = createAction('route-edit/addBetween');
const remove = createAction('route-edit/remove');
const update = createAction('route-edit/update');
const invert = createAction('route-edit/invert');

const select = createAction('route-edit/waypoint/select');
const deSelect = createAction('route-edit/waypoint/deSelect');
const setSelect = createAction('route-edit/waypoint/setSelected');

/**
 * external (complex) redux actions
 */
export const initNewRoute = (name, waypoints) => (dispatch) => {
  dispatch(initRoute(name, waypoints));
};

export const addWaypoint = (waypoint) => (dispatch) => {
  dispatch(add([createWaypoint(waypoint)]));
};

export const addWaypoints = (waypoints) => (dispatch) => {
  dispatch(add(waypoints.map((waypoint) => createWaypoint(waypoint))));
};

export const addWaypointBetween = (data, previousId, nextId) => (dispatch) => {
  const newWaypoint = createWaypoint(data);

  const { id } = newWaypoint;

  const payload = {
    id,
    waypoint: newWaypoint,
    previousId,
    nextId,
  };

  dispatch(addBetween(payload));
};

export const removeWaypoint = (waypointId) => (dispatch) => {
  dispatch(remove([waypointId]));
};

export const removeWaypoints = (waypointIds) => (dispatch) => {
  dispatch(remove(waypointIds));
};

export const invertWaypoints = () => (dispatch) => {
  dispatch(invert());
};

export const moveWaypoint = (id, latlng) => (dispatch) => {
  const payload = {
    id,
    ...latlng,
  };

  dispatch(update([payload]));
};

export const selectWaypoints = (waypointIds) => (dispatch) => {
  dispatch(select(waypointIds));
};

export const deSelectWaypoints = (waypointIds) => (dispatch) => {
  dispatch(deSelect(waypointIds));
};

export const setSelectedWaypoint = (waypointId) => (dispatch) => {
  dispatch(setSelect(waypointId));
};

/**
 * byId redux tree
 */
const waypointsByIdReducer = createReducer({}, {
  [initNewRoute]: (_, action) => action.payload.waypoints.byId,
  [add]: (state, action) => {
    action.payload.forEach((waypoint) => {
      const { id } = waypoint;
      state[id] = waypoint;
    });
  },
  [addBetween]: (state, action) => {
    const { id, waypoint } = action.payload;
    state[id] = waypoint;
  },
  [remove]: (state, action) => {
    action.payload.forEach((id) => {
      delete state[id];
    });
  },
  [update]: (state, action) => {
    action.payload.forEach((waypoint) => {
      const { id } = waypoint;
      state[id] = waypoint;
    });
  },
});

/**
* ids redux tree
*/
const waypointsIdsReducer = createReducer([], {
  [initNewRoute]: (_, action) => action.payload.waypoints.ids,
  [add]: (state, action) => [...state, ...action.payload.map((waypoint) => waypoint.id)],
  [addBetween]: (state, action) => {
    const { id, previousId } = action.payload;
    const sliceAt = state.indexOf(previousId) + 1;

    const part1 = state.slice(0, sliceAt);
    const part2 = state.slice(sliceAt);

    return [...part1, id, ...part2];
  },
  [remove]: (state, action) => [...difference(state, action.payload)],
  [invert]: (state) => state.reverse(),
});

/**
 * selected redux tree
 */
const waypointMetaReducer = createReducer({}, {
  [initNewRoute]: (_, action) => action.payload.waypoints.ids.reduce((prev, cur) => ({
    ...prev,
    [cur]: createMetaObject(),
  }), {}),
  [add]: (state, action) => {
    action.payload.forEach((waypoint) => {
      state[waypoint.id] = createMetaObject();
    });
  },
  [addBetween]: (state, action) => {
    const { id } = action.payload;
    state[id] = createMetaObject();
  },
  [remove]: (state, action) => {
    const newState = { ...state };
    action.payload.forEach((id) => {
      delete newState[id];
    });
    return newState;
  },
  [select]: (state, action) => {
    action.payload.forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.selected = true;
    });
  },
  [deSelect]: (state, action) => {
    action.payload.forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.selected = false;
    });
  },
  [setSelect]: (state, action) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.selected = action.payload.includes(waypointId);
    });
  },
});

/**
 * loaded route tree
 */
const loadedRouteReducer = createReducer('', {
  [initNewRoute]: (_, action) => action.payload.id,
});

/**
* route name tree
*/
const routeNameReducer = createReducer('', {
  [initNewRoute]: (_, action) => action.payload.name,
});

/**
 * create root reducer
 */
const waypointsReducer = combineReducers({
  byId: waypointsByIdReducer,
  ids: waypointsIdsReducer,
  meta: waypointMetaReducer,
});

const routeReducer = combineReducers({
  id: loadedRouteReducer,
  name: routeNameReducer,
});

export default combineReducers({
  actionType: actionTypeReducer,
  multiSelect: multiSelectReducer,
  waypoints: waypointsReducer,
  route: routeReducer,
});
