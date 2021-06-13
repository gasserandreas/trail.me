import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import configureReactors from '../reactors/configureReactors';

// action types
const TRIGGER_REACTOR_ONE = 'TRIGGER_REACTOR_ONE';
const EXECUTE_REACTOR_ONE = 'EXECUTE_REACTOR_ONE';

const TRIGGER_REACTOR_TWO = 'TRIGGER_REACTOR_TWO';
const EXECUTE_REACTOR_TWO = 'EXECUTE_REACTOR_TWO';

const IDLE = 'IDLE';
const MY_FIRST_ACTION = 'MY_FIRST_ACTION';
const MY_SECOND_ACTION = 'MY_SECOND_ACTION';

// simple actions
const triggerReactorOne = () => ({
  type: TRIGGER_REACTOR_ONE,
});

const executeReactorOne = () => ({
  type: EXECUTE_REACTOR_ONE,
});

const triggerReactorTwo = () => ({
  type: TRIGGER_REACTOR_TWO,
});

const executeReactorTwo = () => ({
  type: EXECUTE_REACTOR_TWO,
});

const idle = () => ({
  type: IDLE,
});

const myFirstAction = (payload) => ({
  type: MY_FIRST_ACTION,
  payload,
});

const mySecondAction = (payload) => ({
  type: MY_SECOND_ACTION,
  payload,
});

// complex actions
const doComplexAction = () => (dispatch) => {
  dispatch(executeReactorTwo());

  dispatch(myFirstAction());

  setTimeout(() => {
    dispatch(mySecondAction());
  }, 250);
};

const shouldTriggerReactorOneReducer = (state = false, action) => {
  switch (action.type) {
    case TRIGGER_REACTOR_ONE:
      return true;
    case EXECUTE_REACTOR_ONE:
      return false;
    default:
      return state;
  }
};

const shouldTriggerReactorTwoReducer = (state = false, action) => {
  switch (action.type) {
    case TRIGGER_REACTOR_TWO:
      return true;
    case EXECUTE_REACTOR_TWO:
      return false;
    default:
      return state;
  }
};

const reactorCount = (state = 0, action) => {
  switch (action.type) {
    case EXECUTE_REACTOR_ONE:
    case EXECUTE_REACTOR_TWO:
      return state + 1;
    default:
      return state;
  }
};

const reducers = combineReducers({
  shouldTriggerReactorOne: shouldTriggerReactorOneReducer,
  shouldTriggerReactorTwo: shouldTriggerReactorTwoReducer,
  reactorCount,
});

/**
 * @param {*} createNewStore
 * This enhancer allows us to call redux-mock-store actions
 * on real redux store
 */
const mockEnhancer =
  (createStoreMethod) =>
  (...args) => {
    const store = createStoreMethod(...args);

    // create new dispatch action to keep track of called actions
    let calledActions = [];
    const dispatch = (...dispatchArgs) => {
      // get action from dispatch args
      if (dispatchArgs.length > 0) {
        const action = dispatchArgs[0];
        // persist action
        calledActions.push(action);
      }
      // dispatch action now
      store.dispatch(...dispatchArgs);
    };

    return {
      // destruct store object first
      ...store,
      // add modified dispatch method
      dispatch,
      // add additional redux-mock-store methods to store
      getActions: () => calledActions,
      clearActions: () => {
        calledActions = [];
      },
    };
  };

// create store
const configureStore = (reactors, initialState = {}) => {
  const middleware = [thunkMiddleware];
  const enhancers = [mockEnhancer];

  // create test store
  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers),
  );

  // add reactors
  store.subscribe(configureReactors(store, reactors));

  return store;
};

// create some reactors
const reactorOne = (state) => {
  if (!state.shouldTriggerReactorOne) {
    return null;
  }

  return executeReactorOne();
};

const reactorTwo = (state) => {
  if (!state.shouldTriggerReactorTwo) {
    return null;
  }

  return executeReactorTwo();
};

const reactorComplexAction = (state) => {
  if (!state.shouldTriggerReactorTwo) {
    return null;
  }

  return doComplexAction();
};

it('should not fire additional action without any reactor', () => {
  const store = configureStore([]);
  const action = idle();
  store.dispatch(action);
  store.dispatch(action);

  expect(store.getActions()).toEqual([action, action]);
});

it('should fire reactor one only once', (done) => {
  const store = configureStore([reactorOne]);

  const action = triggerReactorOne();
  const expectedActions = [action, executeReactorOne()];

  // set reactor trigger conditions
  store.dispatch(action);

  setTimeout(() => {
    expect(store.getActions()).toEqual(expectedActions);
    done();
  }, 100);
});

it('should fire reactor two only', (done) => {
  const store = configureStore([reactorTwo]);

  const firstAction = triggerReactorOne();
  const secondAction = triggerReactorTwo();

  const expectedActions = [firstAction, secondAction, executeReactorTwo()];

  store.dispatch(firstAction);
  store.dispatch(secondAction);

  setTimeout(() => {
    expect(store.getActions()).toEqual(expectedActions);
    done();
  }, 100);
});

it('should fire complexAction by reactor', (done) => {
  const store = configureStore([reactorComplexAction]);

  const action = triggerReactorTwo();

  const expectedActions = [action, executeReactorTwo(), myFirstAction(), mySecondAction()];

  store.dispatch(action);

  setTimeout(() => {
    expect(store.getActions()).toEqual(expectedActions);
    done();
  }, 500);
});
