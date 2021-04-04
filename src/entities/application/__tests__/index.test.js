/* global testUtils */
import reducer, {
  AppStatus,
  APPLICATION_STATUS_SET,
  applicationWillLoad,
  applicationDidLoad,
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
});

describe('application: complex actions test suite', () => {
  it('should execute loadApplication', async () => {
    const expectedActions = [
      applicationWillLoad(),
      applicationDidLoad(),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    await loadApplication()(dispatch);
    // test actions
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('application: reducers test suite', () => {
  const initialState = {
    status: AppStatus.INITIAL,
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
});
