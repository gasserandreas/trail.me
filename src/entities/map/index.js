import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

const FRICK_VIEWPORT = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

const SET_VIEWPORT = 'map/setViewport';
const SET_VIEWPORT_COORDINATES = 'map/setViewportCoordinates';
const SET_LOCATION = 'map/setLocation';

export const setViewport = createAction(SET_VIEWPORT);
export const setViewportCoordinates = createAction(SET_VIEWPORT_COORDINATES);
export const setLocation = createAction(SET_LOCATION);

// reducers
const viewport = (state = FRICK_VIEWPORT, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_VIEWPORT:
      return payload;
    case SET_VIEWPORT_COORDINATES:
      return {
        ...state,
        center: payload,
      };
    default:
      return state;
  }
};

const location = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOCATION:
      return payload;
    default:
      return state;
  }
};

export default combineReducers({
  viewport,
  location,
});

export const TESTABLES = {
  viewport,
  location,
  FRICK_VIEWPORT,
};
