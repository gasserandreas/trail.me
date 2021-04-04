import { combineReducers } from 'redux';

export const AppStatus = {
  INITIAL: 'INITIAL',
  APPLICATION_WILL_LOAD: 'APPLICATION_WILL_LOAD',
  APPLICATION_DID_LOAD: 'APPLICATION_DID_LOAD',
};

// action types
export const APPLICATION_USER_SET = 'application/setUser';
export const APPLICATION_STATUS_SET = 'application/setStatus';

// simple actions
export const applicationWillLoad = () => ({
  type: APPLICATION_STATUS_SET,
  payload: AppStatus.APPLICATION_WILL_LOAD,
});

export const applicationDidLoad = () => ({
  type: APPLICATION_STATUS_SET,
  payload: AppStatus.APPLICATION_DID_LOAD,
});

// complex actions
export const loadApplication = () => (async (dispatch) => {
  dispatch(applicationWillLoad());
  return dispatch(applicationDidLoad());
});

// reducers
const status = (state = AppStatus.INITIAL, action) => {
  switch (action.type) {
    case APPLICATION_STATUS_SET:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  status,
});
