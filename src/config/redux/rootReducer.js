import { combineReducers } from 'redux';

import applicationReducer from '../../entities/application';
import waypointsReducer from '../../entities/waypoints';
import mapReducer from '../../entities/map';
import statisticsReducer from '../../entities/statistics';

const reducers = combineReducers({
  appTime: Date.now,
  application: applicationReducer,
  waypoints: waypointsReducer,
  map: mapReducer,
  statistics: statisticsReducer,
});

export default reducers;
