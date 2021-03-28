import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import debounce from 'lodash/debounce';
import ric from 'ric-shim';

import rootReducer from './rootReducer';

import configureReactors from './reactors/configureReactors';
import reactors from './reactors/reactors';

export const APP_IDLE = 'APP_IDLE';

export const getMiddleware = () => {
  // create middleware
  const middleware = [thunkMiddleware];

  return middleware;
};

export const getComposeEnhancers = () => {
  // enable dev tools in development mode only
  if (process.env.NODE_ENV !== 'development') {
    return compose;
  }

  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // eslint-disable-line no-underscore-dangle, max-len
  // fallback to use default compose
  if (typeof devToolsExtension !== 'function') {
    return compose;
  }

  return devToolsExtension;
};

export const getEnhancers = () => [];

const configureStore = (initialState = {}) => {
  // implemented as functions to enable isolated testing
  const enhancers = getEnhancers();
  const middleware = getMiddleware();
  const composeEnhancers = getComposeEnhancers();

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  // add reactors
  store.subscribe(configureReactors(store, reactors));

  // idle configuration
  const idleDispatcher = () => {
    /* istanbul ignore next */
    store.dispatch({ type: APP_IDLE });
  };

  /* istanbul ignore next */
  // debounce app idle all 30 seconds
  const deBounced = debounce(() => {
    // The requestAnimationFrame ensures it doesn't run when tab isn't active
    // the requestIdleCallback makes sure the browser isn't busy with something
    // else.
    /* istanbul ignore next */
    requestAnimationFrame(() => ric(idleDispatcher, { timeout: 500 }));
  }, 30000);

  // Now this will run *each time* something
  // is dispatched. But once it's been 30 seconds
  // since something has happened. It will cause
  // its *own* dispatch. Which then start the cycle
  // over again.
  store.subscribe(deBounced);

  return store;
};

export default configureStore;
