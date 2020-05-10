import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

import difference from 'lodash/difference';

import { createWaypoint, createUniqueArray, addWaypointIdsInBetween } from './utils';

// demo purpose only
import coordinates from './coordinates.json';

const coorindatesById = coordinates.reduce((prev, cur) => ({
  ...prev,
  [cur.id]: cur,
}), {});
const coordinatesIds = coordinates.map(({ id }) => id);
const selectedCoordinates = [coordinates[0].id, coordinates[1].id];

const SET = 'waypoints/set';

const ADD = 'waypoints/add';
const ADD_BETWEEN = 'waypoints/addBetween';
const UPDATE = 'waypoints/update';

const REMOVE = 'waypoints/remove';
const RESET = 'waypoints/reset';

const SELECT = 'waypoints/select';
const DESELECT = 'waypoints/deselect';
const SET_SELECTED = 'waypoints/setSelected';

const set = createAction(SET);

const add = createAction(ADD);
const addBetween = createAction(ADD_BETWEEN);
const update = createAction(UPDATE);

const remove = createAction(REMOVE);
const reset = createAction(RESET);

const select = createAction(SELECT);
const deselct = createAction(DESELECT);
const setSelected = createAction(SET_SELECTED);

// complex functions
export const loadWaypoints = (data) => (dispatch) => {
  console.log(data); // eslint-disable-line no-console

  const byId = {};
  const ids = [];

  const payload = { byId, ids };

  dispatch(set(payload));
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
};

export const moveWaypoint = (id, latlng) => (dispatch) => {
  const payload = {
    id,
    ...latlng,
  };

  dispatch(update(payload));
};

export const removeWaypoints = (ids) => (dispatch) => {
  dispatch(remove(ids));
};

export const resetWaypoints = () => (dispatch) => {
  dispatch(reset());
};

export const setSelectedWaypoints = (ids) => (dispatch) => {
  dispatch(setSelected(ids));
};

export const selectWaypoints = (ids) => (dispatch) => {
  dispatch(select(ids));
};

export const deselectWaypoints = (ids) => (dispatch) => {
  dispatch(deselct(ids));
};

// reducer
// const byId = (state = {}, action) => {
const byIdReducer = (state = coorindatesById, action) => {
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
          ...payload,
        },
      };
    case RESET:
      return {};
    default:
      return state;
  }
};

// const ids = (state = [], action) => {
const idsReducer = (state = coordinatesIds, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return payload.ids;
    case ADD:
      return [...new Set([...state, ...payload.ids])];
    case ADD_BETWEEN:
      // eslint-disable-next-line no-case-declarations
      const { ids, position } = payload;
      return addWaypointIdsInBetween(state, ids, position.prev, position.next);
    case REMOVE:
      return [...difference(state, payload)];
    case RESET:
      return [];
    default:
      return state;
  }
};

const selectedReducer = (state = selectedCoordinates, action) => {
// const selected = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT:
      return createUniqueArray(state, payload);
      // return [...new Set([...state, ...payload])];
    case DESELECT:
      return [...difference(state, payload)];
    case SET_SELECTED:
      return payload;
    case ADD_BETWEEN:
      // eslint-disable-next-line no-case-declarations
      const { ids, position } = payload;
      if (state.includes(position.prev) && state.includes(position.next)) {
        // also select in between ids
        return createUniqueArray(state, ids);
      }
      // simple return old state
      return state;
    case RESET:
    case REMOVE:
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  byId: byIdReducer,
  ids: idsReducer,
  selected: selectedReducer,
});
