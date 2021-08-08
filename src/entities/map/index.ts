import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';

const FRICK_VIEWPORT: ViewPort = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

// const SET_VIEWPORT = 'map/setViewport';
// const SET_VIEWPORT_COORDINATES = 'map/setViewportCoordinates';
// const SET_LOCATION = 'map/setLocation';

export const setViewport = createAction<ViewPort>('map/setViewport');
export const setViewportCoordinates = createAction<ViewPortCoordinates>(
  'map/setViewportCoordinates',
);
export const setLocation = createAction<ViewPortCoordinates>('map/setLocation');

// reducers

const viewportReducer = createReducer(FRICK_VIEWPORT, (builder) => {
  builder.addCase(setViewport, (_, action) => action.payload);
  builder.addCase(setViewportCoordinates, (state, action) => ({
    ...state,
    center: action.payload,
  }));
});

// const viewport = (state = FRICK_VIEWPORT, action) => {
//   const { type, payload } = action;

//   switch (type) {
//     case SET_VIEWPORT:
//       return payload;
//     case SET_VIEWPORT_COORDINATES:
//       return {
//         ...state,
//         center: payload,
//       };
//     default:
//       return state;
//   }
// };

const locationReducer = createReducer([] as unknown as ViewPortCoordinates, (builder) => {
  builder.addCase(setLocation, (_, action) => action.payload);
});

// const location = (state = [] as ViewPortCoordinates, action) => {
//   const { type, payload } = action;

//   switch (type) {
//     case SET_LOCATION:
//       return payload;
//     default:
//       return state;
//   }
// };

export default combineReducers({
  viewport: viewportReducer,
  location: locationReducer,
});

export const __testables__ = {
  viewport: viewportReducer,
  location: locationReducer,
  FRICK_VIEWPORT,
};
