import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import * as uuid from 'uuid';
import difference from 'lodash/difference';

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
const REMOVE = 'waypoints/remove';
const RESET = 'waypoints/reset';

const SELECT = 'waypoints/select';

const set = createAction(SET);
const add = createAction(ADD);
const remove = createAction(REMOVE);
const reset = createAction(RESET);

const select = createAction(SELECT);

// complex functions
export const loadWaypoints = (data) => (dispatch) => {
  console.log(data); // eslint-disable-line no-console

  const byId = {};
  const ids = [];

  const payload = { byId, ids };

  dispatch(set(payload));
};

export const addWaypoint = (data) => (dispatch) => {
  const newWaypoint = {
    id: uuid.v4(),
    ...data,
  };

  dispatch(add([newWaypoint]));
};

export const removeWaypoints = (ids) => (dispatch) => {
  dispatch(remove(ids));
};

export const resetWaypoints = () => (dispatch) => {
  dispatch(reset());
};

export const selectWaypoints = (ids) => (dispatch) => {
  dispatch(select(ids));
};

// reducer
// const byId = (state = {}, action) => {
const byId = (state = coorindatesById, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return payload.byId;
    case ADD:
      return {
        ...state,
        [payload.id]: payload,
      };
    case REMOVE:
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state };
      payload.forEach((id) => {
        delete newState[id];
      });
      return newState;
    case RESET:
      return {};
    default:
      return state;
  }
};

// const ids = (state = [], action) => {
const ids = (state = coordinatesIds, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return payload.ids;
    case ADD:
      return [...new Set([...state, ...payload.ids])];
    case REMOVE:
      return [...difference(state, payload)];
    case RESET:
      return [];
    default:
      return state;
  }
};

const selected = (state = selectedCoordinates, action) => {
// const selected = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT:
      return payload;
    case RESET:
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  ids,
  selected,
});
