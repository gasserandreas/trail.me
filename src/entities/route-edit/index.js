/* eslint-disable no-param-reassign */
import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

import difference from 'lodash/difference';

import MapActions from '../../constants/MapActions';

import { createWaypoint, createWaypoints, createMetaObject } from './utils';
import { waypointsIdsSelector, splitStateSelector } from './selector';
import simplify from './simplifyPath';

import { setViewportCoordinates } from '../map';

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

const splitStart = createAction('route-edit/waypoint/split/start');
const splitConfirm = createAction('route-edit/waypoint/split/confirm');
const splitCancel = createAction('route-edit/waypoint/split/cancel');

/**
 * external (complex) redux actions
 */
export const initNewRoute = (name, waypoints = []) => (dispatch) => {
  const TOLERANCE = 0.00015;
  const simplifiedWaypoints = simplify(waypoints, TOLERANCE, true);

  // set viewport to first waypoint
  if (waypoints.length > 0) {
    const { lat, lng } = waypoints[0];
    dispatch(setViewportCoordinates([lat, lng]));
  }

  dispatch(initRoute(name, simplifiedWaypoints));
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

export const startSplit = (startId) => (dispatch, getStore) => {
  const store = getStore();
  const waypointIds = waypointsIdsSelector(store);

  const startIndex = waypointIds.indexOf(startId);
  const endIndex = startIndex + 1;
  const endId = waypointIds[endIndex];

  const payload = {
    startIndex,
    endIndex,
    startId,
    endId,
  };

  dispatch(splitStart(payload));
};

export const saveSplit = () => (dispatch, getState) => {
  const state = getState();

  const { newIds, start, end } = splitStateSelector(state);
  const payload = { newIds, start, end };

  dispatch(splitConfirm(payload));
};

export const cancelSplit = () => (dispatch, getState) => {
  const state = getState();
  const { newIds } = splitStateSelector(state);
  dispatch(splitCancel(newIds));
};

/**
 * byId redux tree
 */
const waypointsByIdReducer = createReducer({}, {
  [initRoute]: (_, action) => action.payload.waypoints.byId,
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
  [splitCancel]: (state, action) => {
    action.payload.forEach((waypointId) => {
      delete state[waypointId];
    });
  },
});

/**
* ids redux tree
*/
const waypointsIdsReducer = createReducer([], {
  [initRoute]: (_, action) => action.payload.waypoints.ids,
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
  [splitCancel]: (state, action) => [...difference(state, action.payload)],
});

/**
 * meta redux tree
 */
const waypointMetaReducer = createReducer({}, {
  [initRoute]: (_, action) => action.payload.waypoints.ids.reduce((prev, cur) => ({
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
  [splitStart]: (state) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.disabled = true;
      waypoint.selected = false;
    });
  },
  [splitConfirm]: (state) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.disabled = false;
    });
  },
  [splitCancel]: (state) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.disabled = false;
    });
  },
});

/**
 * split tree
 */
const splitReducerInitialState = {
  enabled: false,
  start: {
    id: null,
    index: 0,
  },
  end: {
    id: null,
    index: 0,
  },
  newIds: [],
};

const splitReducer = createReducer(splitReducerInitialState, {
  [splitStart]: (state, action) => {
    const {
      startId,
      endId,
      startIndex,
      endIndex,
    } = action.payload;

    state.enabled = true;

    state.start = {
      id: startId,
      index: startIndex,
    };

    state.end = {
      id: endId,
      index: endIndex,
    };
  },
  [splitCancel]: () => splitReducerInitialState,
  [splitConfirm]: () => splitReducerInitialState,
  [add]: (state, action) => {
    const { enabled } = state;

    if (enabled) {
      action.payload.forEach(({ id }) => {
        state.newIds.push(id);
      });
    }
  },
  [addBetween]: (state, action) => {
    const { enabled } = state;

    if (enabled) {
      state.newIds.push(action.payload.id);
    }
  },
  [remove]: (state, action) => {
    const { enabled } = state;

    if (enabled) {
      state.newIds = [...difference(state.newIds, action.payload)];
    }
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
  split: splitReducer,
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
