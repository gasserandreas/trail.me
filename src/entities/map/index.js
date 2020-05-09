import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

import MapActions from '../../constants/MapActions';

const FRICK_VIEWPORT = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

const SET_VIEWPORT = 'map/setViewport';
const SET_LOCATION = 'map/setLocation';
const SET_ACTION_TYPE = 'map/setActionType';

export const setViewport = createAction(SET_VIEWPORT);
export const setLocation = createAction(SET_LOCATION);
export const setActionType = createAction(SET_ACTION_TYPE);

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

const location = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOCATION:
      return payload;
    default:
      return state;
  }
};

const actionType = (state = MapActions.SELECT, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ACTION_TYPE:
      return payload;
    default:
      return state;
  }
};

export default combineReducers({
  viewport,
  location,
  actionType,
});
