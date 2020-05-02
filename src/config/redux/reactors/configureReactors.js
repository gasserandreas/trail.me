// global store
import ric from 'ric-shim';

export default (store, reactors) => () => {
  const state = store.getState();

  let nextReaction;
  reactors.some((reactor) => {
    const result = reactor(state);
    if (result) {
      nextReaction = result;
      // returning true will stop the loop
      return true;
    }
    return false;
  });

  // if we found something
  // schedule it for dispatch
  if (nextReaction) {
    // We'll use requestIdleCallback where
    // available. This `ric-shim` library
    // I'm using here will fallback to
    // setTimeout(() => {}, 0) if needed.
    ric(() => {
      store.dispatch(nextReaction);
    });
  }
};
