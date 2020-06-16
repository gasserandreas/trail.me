import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';

import MapActions from '../../constants/MapActions';
import MapFileType from '../../constants/MapFileType';

const FRICK_VIEWPORT = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

const SET_VIEWPORT = 'map/setViewport';
const SET_VIEWPORT_COORDINATES = 'map/setViewportCoordinates';
const SET_LOCATION = 'map/setLocation';

const SET_ACTION_TYPE = 'map/setActionType';
const SET_FILE_TYPE = 'map/setFileType';

const SET_MULTI_SELECT = 'map/setMultiSelect';

export const setViewport = createAction(SET_VIEWPORT);
export const setViewportCoordinates = createAction(SET_VIEWPORT_COORDINATES);
export const setLocation = createAction(SET_LOCATION);

export const setActionType = createAction(SET_ACTION_TYPE);
export const setFileType = createAction(SET_FILE_TYPE);

export const setMultiSelect = createAction(SET_MULTI_SELECT);

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

const actionType = (state = MapActions.SELECT, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ACTION_TYPE:
      return payload;
    default:
      return state;
  }
};

const fileType = (state = MapFileType.GPX, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FILE_TYPE:
      return payload;
    default:
      return state;
  }
};

const multiSelect = (state = false, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_MULTI_SELECT:
      return payload;
    default:
      return state;
  }
};

export default combineReducers({
  viewport,
  location,
  actionType,
  fileType,
  multiSelect,
});
