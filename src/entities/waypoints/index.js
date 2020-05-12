import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

import difference from 'lodash/difference';

import {
  createWaypoint,
  addWaypointIdsInBetween,
  createChunkArray,
  generateSelectState,
} from './utils';

import simplify from './simplifyPath';

// demo purpose only
import coordinates from './coordinates.json';

const coorindatesById = coordinates.reduce((prev, cur) => ({
  ...prev,
  [cur.id]: cur,
}), {});
const coordinatesIds = coordinates.map(({ id }) => id);
// const selectedCoordinates = [coordinates[0].id, coordinates[1].id];
const selectedCoordinates = coordinates.reduce((prev, cur) => ({
  ...prev,
  [cur.id]: {
    value: (cur.id === coordinates[0].id || cur.id === coordinates[1].id),
  },
}), {});

const SET = 'waypoints/set';
const SET_PENDING = 'waypoint/setPending';

const ADD = 'waypoints/add';
const ADD_BETWEEN = 'waypoints/addBetween';
const UPDATE = 'waypoints/update';

const REMOVE = 'waypoints/remove';
const RESET = 'waypoints/reset';

const SELECTED_RESET = 'waypoints/selectedReset';
const SELECT = 'waypoints/select';
const DESELECT = 'waypoints/deselect';

const setPending = createAction(SET_PENDING);

const add = createAction(ADD);
const addBetween = createAction(ADD_BETWEEN);
const update = createAction(UPDATE);

const remove = createAction(REMOVE);
const reset = createAction(RESET);

const selectedReset = createAction(SELECTED_RESET);
const select = createAction(SELECT);
const deselct = createAction(DESELECT);

// complex functions
export const loadWaypoints = (waypoints) => (dispatch) => {
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

  dispatch(reset());
  dispatch(setPending(true));

  // dispatch in chunks
  const chunks = createChunkArray(simplifiedWaypoints, 75);

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

    dispatch(add(payload));
  });

  dispatch(setPending(false));
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

export const resetSelectedWaypoints = () => (dispatch) => {
  dispatch(selectedReset());
};

export const selectWaypoints = (ids) => (dispatch) => {
  dispatch(select(ids));
};

export const deselectWaypoints = (ids) => (dispatch) => {
  dispatch(deselct(ids));
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
      return [...state, ...payload.ids];
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
  let newState;

  switch (type) {
    case SELECT:
      return generateSelectState(state, payload, true);
      // newState = state;
      // payload.forEach((id) => {
      //   newState[id] = {
      //     value: true,
      //   };
      // });
      // return newState;
      // newState[payload]
    case DESELECT:
      return generateSelectState(state, payload, false);
    case ADD:
      return generateSelectState(state, payload.ids, false);
    case REMOVE:
      // eslint-disable-next-line no-case-declarations
      newState = { ...state };
      payload.forEach((id) => {
        delete newState[id];
      });
      return newState;
    case SELECTED_RESET:
      return Object.entries(state)
        .reduce((prev, cur) => {
          const id = cur[0];
          return {
            ...prev,
            [id]: {
              value: false,
            },
          };
        }, {});
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
