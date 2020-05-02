import { combineReducers } from 'redux';

import applicationReducer from '../../entities/application/index';

const reducers = combineReducers({
  appTime: Date.now,
  application: applicationReducer,
});

export default reducers;
