import { combineReducers } from 'redux';

import applicationReducer from '../../entities/application';
import waypointsReducer from '../../entities/waypoints';
import mapReducer from '../../entities/map';

const reducers = combineReducers({
  appTime: Date.now,
  application: applicationReducer,
  waypoints: waypointsReducer,
  map: mapReducer,
});

export default reducers;
