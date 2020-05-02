import { combineReducers } from 'redux';

export const AppStatus = {
  INITIAL: 'INITIAL',
  APPLICATION_WILL_LOAD: 'APPLICATION_WILL_LOAD',
  APPLICATION_DID_LOAD: 'APPLICATION_DID_LOAD',
};

// action types
export const APPLICATION_USER_SET = 'APPLICATION_USER_SET';
export const APPLICATION_STATUS_SET = 'APPLICATION_STATUS_SET';

// simple actions
export const applicationWillLoad = () => ({
  type: APPLICATION_STATUS_SET,
  payload: AppStatus.APPLICATION_WILL_LOAD,
});

export const applicationDidLoad = () => ({
  type: APPLICATION_STATUS_SET,
  payload: AppStatus.APPLICATION_DID_LOAD,
});

export const applicationUserSetSuccess = (user) => ({
  type: APPLICATION_USER_SET,
  payload: user,
});

export const applicationUserSetFailure = (error) => ({
  type: APPLICATION_USER_SET,
  payload: error,
  error: true,
});

// complex actions
export const loadApplication = () => (async (dispatch) => {
  dispatch(applicationWillLoad());

  // try to auth user
  try {
    const user = {};
    dispatch(applicationUserSetSuccess(user));
  } catch (error) {
    dispatch(applicationUserSetFailure(error));
  }

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

const user = (state = null, action) => {
  switch (action.type) {
    case APPLICATION_USER_SET:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  status,
  user,
});
