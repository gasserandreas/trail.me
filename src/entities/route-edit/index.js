import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';

import MapActions from '../../constants/MapActions';
import MapFileType from '../../constants/MapFileType';

/**
 * action type redux
 */
export const setActionType = createAction('route-edit/setActionType');
const actionTypeReducer = createReducer(MapActions.SELECT, {
  [setActionType]: (_, payload) => payload,
});


/**
 * file type redux
 */
export const setFileType = createAction('route-edit/setFileType');
const fileTypeReducer = createReducer(MapFileType.GPX, {
  [setFileType]: (_, payload) => payload,
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
 * root reducer
 */
export default combineReducers({
  actionType: actionTypeReducer,
  fileType: fileTypeReducer,
  multiSelect: multiSelectReducer,
});
