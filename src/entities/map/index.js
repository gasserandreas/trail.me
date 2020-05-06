import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

const FRICK_VIEWPORT = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

const SET_VIEWPORT = 'map/setViewport';

export const setViewport = createAction(SET_VIEWPORT);

// reducers
const viewport = (state = FRICK_VIEWPORT, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_VIEWPORT:
      return payload;
    default:
      return state;
  }
};

export default combineReducers({
  viewport,
});
