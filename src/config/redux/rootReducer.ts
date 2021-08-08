import { combineReducers } from 'redux';

import applicationReducer from '../../entities/application';
// import waypointsReducer from '../../entities/waypoints';
import mapReducer from '../../entities/map';

import routeEditReducer from '../../entities/route-edit';
import RouteEditState from '../../entities/route-edit/types';

import statisticsReducer from '../../entities/statistics';

// export type RootState = {
//   appTime: number;
//   application: {
//     status: string;
//   };
//   map: {
//     viewport: {
//       center: Array<number>;
//       zoom: number;
//     };
//     location: Array<number>;
//   };
//   routeEdit: RouteEditState;
//   route: {
//     id: GUID;
//     name: string;
//   };
//   statistics: any;
// };

const reducers = combineReducers({
  appTime: Date.now,
  application: applicationReducer,
  // waypoints: waypointsReducer,
  map: mapReducer,
  routeEdit: routeEditReducer,
  statistics: statisticsReducer,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
