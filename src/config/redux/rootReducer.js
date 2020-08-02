import { combineReducers } from 'redux';

import applicationReducer from '../../entities/application';
// import waypointsReducer from '../../entities/waypoints';
import mapReducer from '../../entities/map';
import routeEditReducer from '../../entities/route-edit';
import statisticsReducer from '../../entities/statistics';

const reducers = combineReducers({
  appTime: Date.now,
  application: applicationReducer,
  // waypoints: waypointsReducer,
  map: mapReducer,
  routeEdit: routeEditReducer,
  statistics: statisticsReducer,
});

export default reducers;
