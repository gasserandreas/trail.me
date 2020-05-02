/* global testUtils */
import reducer, {
  AppStatus,
  APPLICATION_STATUS_SET,
  applicationWillLoad,
  applicationDidLoad,
  APPLICATION_USER_SET,
  applicationUserSetSuccess,
  loadApplication,
} from '../index';

const mockStore = testUtils.createMockStore();

describe('application: simple action test suite', () => {
  it('should create applicationWillLoad action', () => {
    const expectedAction = {
      type: APPLICATION_STATUS_SET,
      payload: AppStatus.APPLICATION_WILL_LOAD,
    };
    expect(applicationWillLoad()).toEqual(expectedAction);
  });

  it('should create applicationDidLoad action', () => {
    const expectedAction = {
      type: APPLICATION_STATUS_SET,
      payload: AppStatus.APPLICATION_DID_LOAD,
    };
    expect(applicationDidLoad()).toEqual(expectedAction);
  });

  it('should create applicationUserSetSuccess action', () => {
    const user = {};
    const expectedAction = {
      type: APPLICATION_USER_SET,
      payload: user,
    };
    expect(applicationUserSetSuccess(user)).toEqual(expectedAction);
  });
});

describe('application: complex actions test suite', () => {
  it('should execute loadApplication', async (done) => {
    const user = {};
    const expectedActions = [
      applicationWillLoad(),
      applicationUserSetSuccess(user),
      applicationDidLoad(),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    await loadApplication()(dispatch);
    // test actions
    expect(store.getActions()).toEqual(expectedActions);

    done();
  });
});

describe('application: reducers test suite', () => {
  const initialState = {
    status: AppStatus.INITIAL,
    user: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle APPLICATION_STATUS_SET', () => {
    // create new action
    const action = applicationDidLoad();

    expect(
      reducer(
        initialState, // use initial state
        action // dispatch action
      )
    ).toEqual({
      ...initialState,
      status: AppStatus.APPLICATION_DID_LOAD,
    });
  });

  it('should handle APPLICATION_USER_SET', () => {
    // create new action
    const user = {};
    const action = applicationUserSetSuccess(user);

    expect(
      reducer(
        initialState, // use initial state
        action // dispatch action
      )
    ).toEqual({
      ...initialState,
      user,
    });
  });
});
