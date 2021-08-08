/* eslint-disable no-param-reassign */
import { combineReducers, Dispatch } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

import difference from 'lodash/difference';

import MapActions from '../../constants/MapActions';
import { RootState } from '../../config/redux/rootReducer';

import { createWaypoint, createWaypoints, createMetaObject } from './utils';
import { waypointsIdsSelector, splitStateSelector } from './selectors';
import simplify from './simplifyPath';

import { setViewportCoordinates } from '../map';

const initRoute = createAction('route-edit/initNew', (name: string, waypoints: Waypoint[]) => ({
  payload: {
    id: uuid.v4(),
    name: name || 'new route',
    waypoints: createWaypoints(waypoints),
  },
}));

/**
 * action type redux
 */
export const setActionType = createAction<string>('route-edit/setActionType');
// const actionTypeReducer = createReducer(MapActions.ADD, {
const actionTypeReducer = createReducer(MapActions.ADD, (builder) => {
  builder.addCase(setActionType, (_, action) => action.payload);
  builder.addCase(initRoute, () => MapActions.ADD);
});

/**
 * multi select redux
 */
export const enableMultiSelect = createAction('route-edit/enableMultiSelect');
export const disableMultiSelect = createAction('route-edit/disableMultiSelect');

// const multiSelectReducer = createReducer(false, {
const multiSelectReducer = createReducer(false, (builder) => {
  builder.addCase(enableMultiSelect, () => true);
  builder.addCase(disableMultiSelect, () => false);
});

/**
 * internal redux action ONLY
 */
const add = createAction<Waypoint[]>('route-edit/add');

type AddBetweenType = {
  id: GUID;
  waypoint: Waypoint;
  previousId: GUID;
  nextId: GUID;
};
const addBetween = createAction<AddBetweenType>('route-edit/addBetween');
const remove = createAction<GUID[]>('route-edit/remove');
const update = createAction<Waypoint[]>('route-edit/update');
const invert = createAction('route-edit/invert');

const select = createAction<GUID[]>('route-edit/waypoint/select');
const deSelect = createAction<GUID[]>('route-edit/waypoint/deSelect');
const setSelect = createAction<GUID[]>('route-edit/waypoint/setSelected');

type SplitStartType = {
  startIndex: number;
  endIndex: number;
  startId: GUID;
  endId: GUID;
};
const splitStart = createAction<SplitStartType>('route-edit/waypoint/split/start');

type SplitConfirmType = {
  newIds: GUID[];
  start: {
    id: GUID;
    index: number;
  };
  end: {
    id: GUID;
    index: number;
  };
};

const splitConfirm = createAction<SplitConfirmType>('route-edit/waypoint/split/confirm');

const splitCancel = createAction<GUID[]>('route-edit/waypoint/split/cancel');

/**
 * external (complex) redux actions
 */
export const initNewRoute =
  (name: string, waypoints: Waypoint[] = []) =>
  (dispatch: Dispatch): void => {
    const TOLERANCE = 0.00015;
    const simplifiedWaypoints = simplify(waypoints, TOLERANCE, true);

    // set viewport to first waypoint
    if (waypoints.length > 0) {
      const { lat, lng } = waypoints[0];
      dispatch(setViewportCoordinates([lat, lng]));
    }

    dispatch(initRoute(name, simplifiedWaypoints));
  };

// export const addWaypoint = (waypoint: Waypoint) => (dispatch: Dispatch) => {
//   dispatch(add([createWaypoint(waypoint)]));
// };

export const addWaypoint: (waypoint: Waypoint) => (dispatch: Dispatch) => void =
  (waypoint) => (dispatch) => {
    dispatch(add([createWaypoint(waypoint)]));
  };

export const addWaypoints: (wapoints: Array<Waypoint>) => (dispatch: Dispatch) => void =
  (waypoints) => (dispatch) => {
    dispatch(add(waypoints.map((waypoint) => createWaypoint(waypoint))));
  };

export const addWaypointBetween: (
  data: Waypoint,
  previousId: GUID,
  nextId: GUID,
) => (dispatch: Dispatch) => void = (data, previousId, nextId) => (dispatch) => {
  const newWaypoint = createWaypoint(data);

  const { id } = newWaypoint;

  const payload = {
    id,
    waypoint: newWaypoint,
    previousId,
    nextId,
  };

  dispatch(addBetween(payload));
};

export const removeWaypoint: (waypointId: GUID) => (dispatch: Dispatch) => void =
  (waypointId) => (dispatch) => {
    dispatch(remove([waypointId]));
  };

export const removeWaypoints: (waypointIds: Array<GUID>) => (dispatch: Dispatch) => void =
  (waypointIds) => (dispatch) => {
    dispatch(remove(waypointIds));
  };

export const invertWaypoints: () => (dispatch: Dispatch) => void = () => (dispatch) => {
  dispatch(invert());
};

export const moveWaypoint: (
  id: GUID,
  latlng: { lat: Latitude; lng: Longitude },
) => (dispatch: Dispatch) => void = (id, latlng) => (dispatch) => {
  const payload: Waypoint = {
    id,
    ...latlng,
  };

  dispatch(update([payload]));
};

export const selectWaypoints: (waypointIds: Array<GUID>) => (dispatch: Dispatch) => void =
  (waypointIds) => (dispatch) => {
    dispatch(select(waypointIds));
  };

export const deSelectWaypoints: (waypointIds: Array<GUID>) => (dispatch: Dispatch) => void =
  (waypointIds) => (dispatch) => {
    dispatch(deSelect(waypointIds));
  };

export const setSelectedWaypoint: (waypointIds: Array<GUID>) => (dispatch: Dispatch) => void =
  (waypointIds) => (dispatch) => {
    dispatch(setSelect(waypointIds));
  };

export const startSplit: (
  startId: GUID,
) => (dispatch: Dispatch, getStore: () => RootState) => void =
  (startId) => (dispatch, getStore) => {
    const store = getStore();
    const waypointIds = waypointsIdsSelector(store);

    const startIndex = waypointIds.indexOf(startId);
    const endIndex = startIndex + 1;
    const endId = waypointIds[endIndex];

    const payload = {
      startIndex,
      endIndex,
      startId,
      endId,
    };

    dispatch(splitStart(payload));
  };

export const saveSplit: () => (dispatch: Dispatch, getState: () => RootState) => void =
  () => (dispatch, getState) => {
    const state = getState();

    const { newIds, start, end } = splitStateSelector(state);

    if (!start || !end) return;

    const payload = { newIds, start, end };

    dispatch(splitConfirm(payload));
  };

export const cancelSplit: () => (dispatch: Dispatch, getState: () => RootState) => void =
  () => (dispatch, getState) => {
    const state = getState();
    const { newIds } = splitStateSelector(state);
    dispatch(splitCancel(newIds));
  };

/**
 * byId redux tree
 */
// const waypointsByIdReducer_ = createReducer(
//   {},
//   {
//     [initRoute]: (_, action) => action.payload.waypoints.byId,
//     [add]: (state, action) => {
//       action.payload.forEach((waypoint) => {
//         const { id } = waypoint;
//         state[id] = waypoint;
//       });
//     },
//     [addBetween]: (state, action) => {
//       const { id, waypoint } = action.payload;
//       state[id] = waypoint;
//     },
//     [remove]: (state, action) => {
//       action.payload.forEach((id) => {
//         delete state[id];
//       });
//     },
//     [update]: (state, action) => {
//       action.payload.forEach((waypoint) => {
//         const { id } = waypoint;
//         state[id] = waypoint;
//       });
//     },
//     [splitCancel]: (state, action) => {
//       action.payload.forEach((waypointId) => {
//         delete state[waypointId];
//       });
//     },
//   },
// );

const waypointsByIdReducerInitialState: { [key: string]: Waypoint } = {};

const waypointsByIdReducer = createReducer(waypointsByIdReducerInitialState, (builder) => {
  builder.addCase(initRoute, (_, action) => action.payload.waypoints.byId);
  builder.addCase(add, (state, action) => {
    const newState = { ...state };

    action.payload.forEach((waypoint: Waypoint) => {
      const { id } = waypoint;
      newState[id] = waypoint;
    });

    return newState;
  });
  builder.addCase(addBetween, (state, action) => {
    const { id, waypoint } = action.payload;
    state[id] = waypoint;
  });
  builder.addCase(remove, (state, action) => {
    action.payload.forEach((id) => {
      delete state[id];
    });
  });
  builder.addCase(update, (state, action) => {
    action.payload.forEach((waypoint: Waypoint) => {
      const { id } = waypoint;
      state[id] = waypoint;
    });
  });
  builder.addCase(splitCancel, (state, action) => {
    action.payload.forEach((waypointId) => {
      delete state[waypointId];
    });
  });
});

/**
 * ids redux tree
 */
// const waypointsIdsReducer_ = createReducer([], {
//   [initRoute]: (_, action) => action.payload.waypoints.ids,
//   [add]: (state, action) => [...state, ...action.payload.map((waypoint) => waypoint.id)],
//   [addBetween]: (state, action) => {
//     const { id, previousId } = action.payload;
//     const sliceAt = state.indexOf(previousId) + 1;

//     const part1 = state.slice(0, sliceAt);
//     const part2 = state.slice(sliceAt);

//     return [...part1, id, ...part2];
//   },
//   [remove]: (state, action) => [...difference(state, action.payload)],
//   [invert]: (state) => state.reverse(),
//   [splitCancel]: (state, action) => [...difference(state, action.payload)],
// });

const waypointsIdsReducerInitialState: Array<GUID> = [];

const waypointsIdsReducer = createReducer(waypointsIdsReducerInitialState, (builder) => {
  builder.addCase(initRoute, (_, action) => action.payload.waypoints.ids);
  builder.addCase(add, (state, action) => [
    ...state,
    ...action.payload.map((waypoint) => waypoint.id),
  ]);
  builder.addCase(addBetween, (state, action) => {
    const { id, previousId } = action.payload;
    const sliceAt = state.indexOf(previousId) + 1;

    const part1 = state.slice(0, sliceAt);
    const part2 = state.slice(sliceAt);

    return [...part1, id, ...part2];
  });
  builder.addCase(remove, (state, action) => [...difference(state, action.payload)]);
  builder.addCase(invert, (state) => state.reverse());
  builder.addCase(splitCancel, (state, action) => [...difference(state, action.payload)]);
});

/**
 * meta redux tree
 */
// const waypointMetaReducer_ = createReducer(
//   {},
//   {
//     [initRoute]: (_, action) =>
//       action.payload.waypoints.ids.reduce(
//         (prev, cur) => ({
//           ...prev,
//           [cur]: createMetaObject(),
//         }),
//         {},
//       ),
//     [add]: (state, action) => {
//       action.payload.forEach((waypoint) => {
//         state[waypoint.id] = createMetaObject();
//       });
//     },
//     [addBetween]: (state, action) => {
//       const { id } = action.payload;
//       state[id] = createMetaObject();
//     },
//     [remove]: (state, action) => {
//       const newState = { ...state };
//       action.payload.forEach((id) => {
//         delete newState[id];
//       });
//       return newState;
//     },
//     [select]: (state, action) => {
//       action.payload.forEach((waypointId) => {
//         const waypoint = state[waypointId];
//         waypoint.selected = true;
//       });
//     },
//     [deSelect]: (state, action) => {
//       action.payload.forEach((waypointId) => {
//         const waypoint = state[waypointId];
//         waypoint.selected = false;
//       });
//     },
//     [setSelect]: (state, action) => {
//       Object.keys(state).forEach((waypointId) => {
//         const waypoint = state[waypointId];
//         waypoint.selected = action.payload.includes(waypointId);
//       });
//     },
//     [splitStart]: (state) => {
//       Object.keys(state).forEach((waypointId) => {
//         const waypoint = state[waypointId];
//         waypoint.disabled = true;
//         waypoint.selected = false;
//       });
//     },
//     [splitConfirm]: (state) => {
//       Object.keys(state).forEach((waypointId) => {
//         const waypoint = state[waypointId];
//         waypoint.disabled = false;
//       });
//     },
//     [splitCancel]: (state, action) => {
//       // remove unused waypoints
//       action.payload.forEach((waypointId) => {
//         delete state[waypointId];
//       });

//       // reset meta state
//       Object.keys(state).forEach((waypointId) => {
//         const waypoint = state[waypointId];
//         waypoint.disabled = false;
//       });
//     },
//   },
// );

const waypointMetaReducerInitialState: { [key: string]: WaypointMeta } = {};

const waypointMetaReducer = createReducer(waypointMetaReducerInitialState, (builder) => {
  builder.addCase(initRoute, (_, action) =>
    action.payload.waypoints.ids.reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: createMetaObject(),
      }),
      {},
    ),
  );
  builder.addCase(add, (state, action) => {
    action.payload.forEach((waypoint) => {
      state[waypoint.id] = createMetaObject();
    });
  });
  builder.addCase(addBetween, (state, action) => {
    const { id } = action.payload;
    state[id] = createMetaObject();
  });
  builder.addCase(remove, (state, action) => {
    const newState = { ...state };
    action.payload.forEach((id) => {
      delete newState[id];
    });
    return newState;
  });
  builder.addCase(select, (state, action) => {
    action.payload.forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.selected = true;
    });
  });
  builder.addCase(deSelect, (state, action) => {
    action.payload.forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.selected = false;
    });
  });
  builder.addCase(setSelect, (state, action) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.selected = action.payload.includes(waypointId);
    });
  });
  builder.addCase(splitStart, (state) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.disabled = true;
      waypoint.selected = false;
    });
  });
  builder.addCase(splitConfirm, (state) => {
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.disabled = false;
    });
  });
  builder.addCase(splitCancel, (state, action) => {
    // remove unused waypoints
    action.payload.forEach((waypointId) => {
      delete state[waypointId];
    });

    // reset meta state
    Object.keys(state).forEach((waypointId) => {
      const waypoint = state[waypointId];
      waypoint.disabled = false;
    });
  });
});

/**
 * split tree
 */
const splitReducerInitialState: WaypointSplit = {
  enabled: false,
  start: undefined,
  end: undefined,
  // start: {
  //   id: null,
  //   index: 0,
  // },
  // end: {
  //   id: null,
  //   index: 0,
  // },
  newIds: [],
};

// const splitReducer_ = createReducer(splitReducerInitialState, {
//   [splitStart]: (state, action) => {
//     const { startId, endId, startIndex, endIndex } = action.payload;

//     state.enabled = true;

//     state.start = {
//       id: startId,
//       index: startIndex,
//     };

//     state.end = {
//       id: endId,
//       index: endIndex,
//     };
//   },
//   [splitCancel]: () => splitReducerInitialState,
//   [splitConfirm]: () => splitReducerInitialState,
//   [add]: (state, action) => {
//     const { enabled } = state;

//     if (enabled) {
//       action.payload.forEach(({ id }) => {
//         state.newIds.push(id);
//       });
//     }
//   },
//   [addBetween]: (state, action) => {
//     const { enabled } = state;

//     if (enabled) {
//       state.newIds.push(action.payload.id);
//     }
//   },
//   [remove]: (state, action) => {
//     const { enabled } = state;

//     if (enabled) {
//       state.newIds = [...difference(state.newIds, action.payload)];
//     }
//   },
// });

// const splitReducerInitialState: WaypointSplit = {
//   enabled: false,
//   newIds: [],
// };

const splitReducer = createReducer(splitReducerInitialState, (builder) => {
  builder.addCase(splitStart, (state, action) => {
    const { startId, endId, startIndex, endIndex } = action.payload;
    return {
      enabled: true,
      start: {
        id: startId,
        index: startIndex,
      },
      end: {
        id: endId,
        index: endIndex,
      },
      newIds: state.newIds,
    };
  });
  builder.addCase(splitCancel, () => splitReducerInitialState);
  builder.addCase(splitConfirm, () => splitReducerInitialState);
  builder.addCase(add, (state, action) => {
    const { enabled } = state;

    if (enabled) {
      action.payload.forEach(({ id }) => {
        state.newIds.push(id);
      });
    }
  });
  builder.addCase(addBetween, (state, action) => {
    const { enabled } = state;

    if (enabled) {
      state.newIds.push(action.payload.id);
    }
  });
  builder.addCase(remove, (state, action) => {
    const { enabled } = state;

    if (enabled) {
      state.newIds = [...difference(state.newIds, action.payload)];
    }
  });
});

/**
 * loaded route tree
 */
// const loadedRouteReducer = createReducer('', {
//   [initRoute]: (_, action) => action.payload.id,
// });

const loadedRouteReducer = createReducer('', (builder) => {
  builder.addCase(initRoute, (_, action) => action.payload.id);
});

/**
 * route name tree
 */
// const routeNameReducer = createReducer('', {
//   [initRoute]: (_, action) => action.payload.name,
// });

const routeNameReducer = createReducer('', (builder) => {
  builder.addCase(initRoute, (_, action) => action.payload.name);
});

/**
 * create root reducer
 */
const waypointsReducer = combineReducers({
  byId: waypointsByIdReducer,
  ids: waypointsIdsReducer,
  meta: waypointMetaReducer,
  split: splitReducer,
});

const routeReducer = combineReducers({
  id: loadedRouteReducer,
  name: routeNameReducer,
});

export default combineReducers({
  actionType: actionTypeReducer,
  multiSelect: multiSelectReducer,
  waypoints: waypointsReducer,
  route: routeReducer,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __testables__ = {
  initRoute,
  add,
  addBetween,
  remove,
  update,
  invert,
  select,
  deSelect,
  setSelect,
  splitStart,
  splitConfirm,
  splitCancel,
  splitReducerInitialState,
};
