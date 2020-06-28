import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

import difference from 'lodash/difference';

import {
  createWaypoint,
  addWaypointIdsInBetween,
  createChunkArray,
  updateSelectState,
  generateSelectState,
} from './utils';

import simplify from './simplifyPath';

import { selectedWaypointIdsSelector, waypointsIdsSelector } from './selector';

import { setViewportCoordinates } from '../map';
import { calculateStats, resetStats } from '../statistics';

/* demo only */
import coordinates from './coordinates.json';

const exampleById = {};
const exampleIds = [];
const exampleSelected = {};

coordinates.forEach((coordinate) => {
  const { id } = coordinate;
  exampleById[id] = coordinate;
  exampleSelected[id] = { value: false };
  exampleIds.push(id);
});

const SET = 'waypoints/set';
const SET_PENDING = 'waypoint/setPending';

const ADD = 'waypoints/add';
const ADD_BETWEEN = 'waypoints/addBetween';
const UPDATE = 'waypoints/update';
const INVERT = 'waypoints/invert';

const REMOVE = 'waypoints/remove';
const RESET = 'waypoints/reset';

const SELECTED_RESET = 'waypoints/selectedReset';
const SELECT = 'waypoints/select';
const DESELECT = 'waypoints/deselect';
const SET_SELECTED = 'waypoints/setSelected';

const setPending = createAction(SET_PENDING);

const add = createAction(ADD);
const addBetween = createAction(ADD_BETWEEN);
const update = createAction(UPDATE);
const invert = createAction(INVERT);

const remove = createAction(REMOVE);
const reset = createAction(RESET);

const selectedReset = createAction(SELECTED_RESET);
const select = createAction(SELECT);
const deselct = createAction(DESELECT);
const setSelected = createAction(SET_SELECTED);

// complex functions
export const loadWaypoints = (waypoints, resetWaypoints = true) => (dispatch) => {
  /**
   * Make sure x and y is set
   */
  const converterWaypoints = waypoints.map(({ lat, lng, ...rest }) => ({
    x: lat,
    y: lng,
    lat,
    lng,
    ...rest,
  }));

  const TOLERANCE = 0.00015;
  const simplifiedWaypoints = simplify(converterWaypoints, TOLERANCE, true);

  // reset waypoints first
  if (resetWaypoints) {
    dispatch(reset());
  }

  dispatch(setPending(true));

  // dispatch in chunks
  const chunks = createChunkArray(simplifiedWaypoints, 75);

  let waypointIds = [];

  chunks.forEach((chunk) => {
    const byId = {};
    const ids = [];

    chunk.forEach(({ x, y, ...data }) => {
      const waypoint = createWaypoint(data);
      const { id } = waypoint;

      byId[id] = waypoint;
      ids.push(id);
    });

    const payload = { byId, ids };

    waypointIds = [...waypointIds, ...ids];

    dispatch(add(payload));
  });

  // get first coordinate and set map center
  const first = waypoints[0];
  if (first) {
    const { lat, lng } = first;
    dispatch(setViewportCoordinates([lat, lng]));
  }

  dispatch(setPending(false));

  // calculate statistics
  dispatch(calculateStats(waypointIds));
};

export const addWaypoint = (data) => (dispatch) => {
  const newWaypoint = createWaypoint(data);
  const { id } = newWaypoint;

  const payload = {
    byId: {
      [id]: newWaypoint,
    },
    ids: [id],
  };

  dispatch(add(payload));
  dispatch(calculateStats());
};

export const addWaypointBetween = (data, prevId, nextId) => (dispatch) => {
  const newWaypoint = createWaypoint(data);

  const { id } = newWaypoint;
  const byId = { [id]: newWaypoint };
  const ids = [id];

  const payload = {
    byId,
    ids,
    position: {
      prev: prevId,
      next: nextId,
    },
  };
  dispatch(addBetween(payload));
  dispatch(calculateStats());
};

export const moveWaypoint = (id, latlng) => (dispatch) => {
  const payload = {
    id,
    ...latlng,
  };

  dispatch(update(payload));
  dispatch(calculateStats());
};

export const removeWaypoints = (ids) => (dispatch) => {
  dispatch(remove(ids));
  dispatch(calculateStats());
};

export const removeSelectedWaypoints = () => (dispatch, getStore) => {
  const store = getStore();
  const selectedIds = selectedWaypointIdsSelector(store);
  const ids = waypointsIdsSelector(store);
  dispatch(remove(selectedIds));

  // select next element
  const lastSelectedId = selectedIds[selectedIds.length - 1];
  const nextSelectedIndex = ids.indexOf(lastSelectedId) - 1;
  const nextSelectedId = nextSelectedIndex < (ids.length - 1) ? ids[nextSelectedIndex] : null;

  if (nextSelectedId) {
    dispatch(setSelected([nextSelectedId]));
  }
};

export const invertWaypoints = () => (dispatch) => {
  dispatch(invert());
  dispatch(calculateStats());
};

export const resetWaypoints = () => (dispatch) => {
  dispatch(reset());

  // reset statistics
  dispatch(resetStats());
};

export const resetSelectedWaypoints = () => (dispatch) => {
  dispatch(selectedReset());
};

export const selectWaypoints = (ids) => (dispatch) => {
  dispatch(select(ids));
};

export const deselectWaypoints = (ids) => (dispatch) => {
  dispatch(deselct(ids));
};

export const setSelectedWaypoints = (ids) => (dispatch) => {
  dispatch(setSelected(ids));
};

// reducer
const pendingReducer = (state = false, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PENDING:
      return payload;
    default:
      return state;
  }
};

const byIdReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return payload.byId;
    case ADD:
    case ADD_BETWEEN:
      return {
        ...state,
        ...payload.byId,
      };
    case REMOVE:
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state };
      payload.forEach((id) => {
        delete newState[id];
      });
      return newState;
    case UPDATE:
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          elevation: null,
          time: null,
          ...payload,
        },
      };
    case RESET:
      return {};
    default:
      return state;
  }
};

const idsReducer = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return payload.ids;
    case ADD:
      return [...state, ...payload.ids];
    case ADD_BETWEEN:
      // eslint-disable-next-line no-case-declarations
      const { ids, position } = payload;
      return addWaypointIdsInBetween(state, ids, position.prev, position.next);
    case REMOVE:
      return [...difference(state, payload)];
    case INVERT:
      return state.reverse();
    case RESET:
      return [];
    default:
      return state;
  }
};

const selectedReducer = (state = {}, action) => {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case SET_SELECTED:
      return generateSelectState(state, payload, true);
    case SELECT:
      return updateSelectState(state, payload, true);
    case DESELECT:
      return updateSelectState(state, payload, false);
    case ADD_BETWEEN:
      return generateSelectState(state, payload.ids, true);
    case ADD:
      return updateSelectState(state, payload.ids, false);
    case REMOVE:
      // eslint-disable-next-line no-case-declarations
      newState = { ...state };
      payload.forEach((id) => {
        delete newState[id];
      });
      return newState;
    case SELECTED_RESET:
      return generateSelectState(state, Object.keys(state), false);
    case RESET:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  pending: pendingReducer,
  byId: byIdReducer,
  ids: idsReducer,
  selected: selectedReducer,
});
