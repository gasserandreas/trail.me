/* global testUtils */
import simplify from '../simplifyPath';

import { setViewportCoordinates } from '../../map';

import reducer, {
  setActionType,
  enableMultiSelect,
  disableMultiSelect,
  initNewRoute,
  addWaypoint,
  addWaypoints,
  addWaypointBetween,
  removeWaypoint,
  removeWaypoints,
  invertWaypoints,
  moveWaypoint,
  selectWaypoints,
  deSelectWaypoints,
  setSelectedWaypoint,
  startSplit,
  saveSplit,
  cancelSplit,
  __testables__,
} from '../index';

import { createMetaObject, createWaypoint } from '../utils';
import MapActions from '../../../constants/MapActions';

import mockedWaypoints from '../__data__/mockedWaypoints.json';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: () => '650b4c7d-e291-40a8-b13f-830fa8c5b770',
}));

jest.mock('../simplifyPath', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((waypoints) => waypoints),
}));

// const mockedWaypoints = [
//   {
//     id: '4f72ec93-d59c-4084-8822-01e78ce38a84',
//     lat: 47.505528707,
//     lng: 8.021819313,
//   },
//   {
//     id: 'c4cd3414-fa91-48dd-a814-080e9f1c4802',
//     lat: 47.503772414,
//     lng: 8.013305263,
//   }
// ];

describe('entities/route-edit simple action test suite', () => {
  it('should create initReducer action', () => {
    expect(__testables__.initRoute('mocked name', mockedWaypoints))
      .toMatchSnapshot();

    expect(__testables__.initRoute(null, mockedWaypoints))
      .toMatchSnapshot();
  });

  it('should create setActionType action', () => {
    expect(setActionType()).toMatchSnapshot();
  });

  it('should create enableMultiSelect action', () => {
    expect(enableMultiSelect()).toMatchSnapshot();
  });

  it('should create disableMultiSelect action', () => {
    expect(disableMultiSelect()).toMatchSnapshot();
  });

  it('should create add action', () => {
    expect(__testables__.add(mockedWaypoints)).toMatchSnapshot();
  });

  it('should create addBetween action', () => {
    const payload = {
      id: mockedWaypoints[0].id,
      waypoint: mockedWaypoints[0],
    };
    expect(__testables__.addBetween(payload)).toMatchSnapshot();
  });

  it('should create remove action', () => {
    expect(__testables__.remove(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });

  it('should create update action', () => {
    expect(__testables__.update(mockedWaypoints)).toMatchSnapshot();
  });

  it('should create invert action', () => {
    expect(__testables__.invert()).toMatchSnapshot();
  });

  it('should create select action', () => {
    expect(__testables__.select(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });

  it('should create deSelect action', () => {
    expect(__testables__.deSelect(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });

  it('should create setSelect action', () => {
    expect(__testables__.setSelect(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });

  it('should create splitStart action', () => {
    expect(__testables__.splitStart(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });

  it('should create splitConfirm action', () => {
    expect(__testables__.splitConfirm(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });
  it('should create splitCancel action', () => {
    expect(__testables__.splitCancel(mockedWaypoints.map(({ id }) => id))).toMatchSnapshot();
  });
});

describe('entities/route-edit complex action test suite', () => {
  const mockStore = testUtils.createMockStore();

  it('should execute initNewRoute', () => {
    const mockedName = 'new route name';
    const simplifiedWaypoints = simplify(mockedWaypoints);
    const { lat, lng } = mockedWaypoints[0];
    const expectedActions = [
      setViewportCoordinates([lat, lng]),
      __testables__.initRoute(mockedName, simplifiedWaypoints),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    initNewRoute(mockedName, mockedWaypoints)(dispatch);
    // test actions
    expect(store.getActions()).toEqual(expectedActions);

    // check parameters for simplify function
    expect(simplify.mock.calls[1][1]).toEqual(0.00015);
  });

  it('should execute initNewRoute with empty waypoints', () => {
    const mockedName = 'new route name';
    const waypoints = [];
    const expectedActions = [
      __testables__.initRoute(mockedName, waypoints),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    initNewRoute(mockedName)(dispatch);
    // test actions
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute addWaypoint', () => {
    const expectedActions = [
      __testables__.add([createWaypoint(mockedWaypoints[0])]),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    addWaypoint(mockedWaypoints[0])(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute addWaypoints', () => {
    const expectedActions = [
      __testables__.add(
        mockedWaypoints.map((waypoint) => createWaypoint(waypoint))
      ),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    addWaypoints(mockedWaypoints)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute addWaypointBetween', () => {
    const data = mockedWaypoints[0];
    const previousId = '3023a7b8-f6f4-40a5-8730-0a4ab1f2caca';
    const nextId = '094d7343-8069-4d65-927f-346bd82874ea';

    const newWaypoint = createWaypoint(data);

    const expectedActions = [
      __testables__.addBetween({
        id: newWaypoint.id,
        waypoint: newWaypoint,
        previousId,
        nextId,
      }),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    addWaypointBetween(data, previousId, nextId)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute removeWaypoint', () => {
    const { id } = mockedWaypoints[0];

    const expectedActions = [
      __testables__.remove([id]),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    removeWaypoint(id)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute removeWaypoints', () => {
    const ids = mockedWaypoints.map(({ id }) => id);

    const expectedActions = [
      __testables__.remove(ids),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    removeWaypoints(ids)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute invertWaypoints', () => {
    const expectedActions = [
      __testables__.invert(),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    invertWaypoints()(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute moveWaypoint', () => {
    const id = '094d7343-8069-4d65-927f-346bd82874ea';
    const latlng = {
      lat: 47.502039961,
      lng: 8.008972931,
    };

    const expectedActions = [
      __testables__.update([{
        id,
        ...latlng,
      }]),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    moveWaypoint(id, latlng)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute selectWaypoints', () => {
    const ids = mockedWaypoints.map(({ id }) => id);
    const expectedActions = [
      __testables__.select(ids),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    selectWaypoints(ids)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute deSelectWaypoints', () => {
    const ids = mockedWaypoints.map(({ id }) => id);
    const expectedActions = [
      __testables__.deSelect(ids),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    deSelectWaypoints(ids)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute setSelectedWaypoint', () => {
    const ids = mockedWaypoints.map(({ id }) => id);
    const expectedActions = [
      __testables__.setSelect(ids),
    ];

    // get store access
    const store = mockStore();
    const { dispatch } = store;

    setSelectedWaypoint(ids)(dispatch);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute startSplit', () => {
    const waypointIds = mockedWaypoints.map((waypoint) => waypoint.id);
    const startId = waypointIds[0];

    const startIndex = waypointIds.indexOf(startId);
    const endIndex = startIndex + 1;
    const endId = waypointIds[endIndex];

    const expectedActions = [
      __testables__.splitStart({
        startIndex,
        endIndex,
        startId,
        endId,
      }),
    ];

    // get store access
    const state = {
      routeEdit: {
        waypoints: {
          ids: waypointIds,
        },
      },
    };
    const store = mockStore(() => state);
    const { dispatch } = store;
    const getStore = () => state;

    startSplit(startId)(dispatch, getStore);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute saveSplit', () => {
    const newIds = [];
    const start = {
      id: null,
      index: 0,
    };
    const end = {
      id: null,
      index: 0,
    };

    const expectedActions = [
      __testables__.splitConfirm({
        newIds,
        start,
        end,
      }),
    ];

    const state = {
      routeEdit: {
        waypoints: {
          split: {
            newIds,
            start,
            end,
          },
        },
      },
    };

    // get store access
    const store = mockStore(() => state);
    const { dispatch } = store;
    const getStore = () => state;

    saveSplit()(dispatch, getStore);

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should execute cancelSplit', () => {
    const newIds = [];

    const expectedActions = [
      __testables__.splitCancel(newIds),
    ];

    const state = {
      routeEdit: {
        waypoints: {
          split: {
            newIds,
          },
        },
      },
    };

    // get store access
    const store = mockStore(() => state);
    const { dispatch } = store;
    const getStore = () => state;

    cancelSplit()(dispatch, getStore);

    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('entities/route-edit reducer test suite', () => {
  const initialState = {
    actionType: MapActions.SELECT,
    multiSelect: false,
    waypoints: {
      byId: {},
      ids: [],
      meta: {},
      split: {
        enabled: false,
        start: {
          id: null,
          index: 0,
        },
        end: {
          id: null,
          index: 0,
        },
        newIds: [],
      },
    },
    route: {
      id: '',
      name: '',
    },
  };

  it('should handle route-edit/setActionType', () => {
    const action = setActionType(MapActions.REMOVE);

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionType: MapActions.REMOVE,
    });
  });

  it('should handle route-edit/enableMultiSelect', () => {
    const action = enableMultiSelect();

    expect(initialState.multiSelect).toEqual(false);

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      multiSelect: true,
    });
  });

  it('should handle route-edit/disableMultiSelect', () => {
    const action = disableMultiSelect();

    const updateInitialState = {
      ...initialState,
      multiSelect: true,
    };

    expect(updateInitialState.multiSelect).toEqual(true);

    expect(reducer(updateInitialState, action)).toEqual({
      ...updateInitialState,
      multiSelect: false,
    });
  });

  it('should handle route-edit/initNew', () => {
    const name = 'new route';

    const action = __testables__.initRoute(name, mockedWaypoints);

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionType: MapActions.ADD,
      route: {
        id: '650b4c7d-e291-40a8-b13f-830fa8c5b770',
        name,
      },
      waypoints: {
        ...initialState.waypoints,
        byId: mockedWaypoints.reduce((prev, cur) => ({
          ...prev,
          [cur.id]: cur,
        }), {}),
        ids: mockedWaypoints.map(({ id }) => id),
        meta: mockedWaypoints.map(({ id }) => id)
          .reduce((prev, cur) => ({
            ...prev,
            [cur]: createMetaObject(),
          }), {}),
      },
    });
  });

  it('should handle route-edit/add', () => {
    const waypoint = mockedWaypoints[0];
    const action = __testables__.add([waypoint]);

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [waypoint.id]: waypoint,
        },
        ids: [waypoint.id],
        meta: {
          [waypoint.id]: createMetaObject(),
        },
      },
    });
  });

  it('should handle route-edit/addBetween', () => {
    const newId = '094d7343-8069-4d65-927f-346bd82874ea';
    const newWaypoint = {
      id: newId,
      lat: 47.502039961,
      lng: 8.008972931,
    };

    const payload = {
      id: newId,
      waypoint: newWaypoint,
      previousId: mockedWaypoints[0].id,
      nextId: mockedWaypoints[1].id
    };
    const action = __testables__.addBetween(payload);

    const updateInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    expect(reducer(updateInitialState, action)).toEqual({
      ...updateInitialState,
      waypoints: {
        ...updateInitialState.waypoints,
        byId: {
          ...updateInitialState.waypoints.byId,
          [newWaypoint.id]: newWaypoint,
        },
        ids: [
          mockedWaypoints[0].id,
          newWaypoint.id,
          mockedWaypoints[1].id,
        ],
        meta: {
          ...updateInitialState.waypoints.meta,
          [newWaypoint.id]: createMetaObject(),
        },
      },
    });
  });

  it('should handle route-edit/remove', () => {
    const action = __testables__.remove([mockedWaypoints[0].id]);

    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    expect(reducer(updatedInitialState, action)).toEqual({
      ...updatedInitialState,
      waypoints: {
        ...updatedInitialState.waypoints,
        byId: {
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [mockedWaypoints[1].id],
        meta: {
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    });
  });

  it('should handle route-edit/update', () => {
    const payload = {
      id: mockedWaypoints[0].id,
      lat: 1,
      lng: 1,
    };
    const action = __testables__.update([payload]);

    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    expect(reducer(updatedInitialState, action)).toEqual({
      ...updatedInitialState,
      waypoints: {
        ...updatedInitialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: payload,
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
      },
    });
  });

  it('should handle route-edit/invert', () => {
    const action = __testables__.invert();

    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    expect(reducer(updatedInitialState, action)).toEqual({
      ...updatedInitialState,
      waypoints: {
        ...updatedInitialState.waypoints,
        ids: [
          mockedWaypoints[1].id,
          mockedWaypoints[0].id,
        ],
      },
    });
  });

  it('should handle route-edit/select', () => {
    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    const selectedId = mockedWaypoints[0].id;
    const action = __testables__.select([selectedId]);

    /**
     * non waypoint should be selected
     */
    expect(
      Object.values(updatedInitialState.waypoints.meta)
        .filter((item) => item.selected)
    ).toEqual([]);

    /**
     * waypoint should be selected now
     */
    const afterSelectActionState = reducer(updatedInitialState, action);
    expect(afterSelectActionState.waypoints.meta).toEqual({
      ...updatedInitialState.waypoints.meta,
      [selectedId]: {
        ...updatedInitialState.waypoints.meta[selectedId],
        selected: true,
      },
    });
  });

  it('should handle route-edit/deSelect', () => {
    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: {
            ...createMetaObject(),
            selected: true,
          },
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    const deSelectId = mockedWaypoints[0].id;
    const action = __testables__.deSelect([deSelectId]);

    /**
     * only the deSelectId id should be selected
     */
    expect(
      Object.entries(updatedInitialState.waypoints.meta)
        .filter(([_, item]) => item.selected) // eslint-disable-line no-unused-vars
        .map(([id]) => id)
    ).toEqual([deSelectId]);

    /**
     * waypoint should be deSelected now
     */
    const afterSelectActionState = reducer(updatedInitialState, action);
    expect(afterSelectActionState.waypoints.meta).toEqual({
      ...updatedInitialState.waypoints.meta,
      [deSelectId]: {
        ...updatedInitialState.waypoints.meta[deSelectId],
        selected: false,
      },
    });
  });

  it('should handle route-edit/setSelect', () => {
    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    const selectedIds = [mockedWaypoints[0].id, mockedWaypoints[1].id];
    const action = __testables__.setSelect(selectedIds);

    /**
     * non waypoint should be selected
     */
    expect(
      Object.values(updatedInitialState.waypoints.meta)
        .filter((item) => item.selected)
    ).toEqual([]);

    /**
     * waypoint should be selected now
     */
    const afterSelectActionState = reducer(updatedInitialState, action);
    expect(afterSelectActionState.waypoints.meta).toEqual({
      ...updatedInitialState.waypoints.meta,
      [mockedWaypoints[0].id]: {
        ...updatedInitialState.waypoints.meta[mockedWaypoints[0].id],
        selected: true,
      },
      [mockedWaypoints[1].id]: {
        ...updatedInitialState.waypoints.meta[mockedWaypoints[1].id],
        selected: true,
      },
    });
  });

  describe('route-edit/split test suite', () => {
    const updatedInitialState = {
      ...initialState,
      waypoints: {
        ...initialState.waypoints,
        byId: {
          [mockedWaypoints[0].id]: mockedWaypoints[0],
          [mockedWaypoints[1].id]: mockedWaypoints[1],
        },
        ids: [
          mockedWaypoints[0].id,
          mockedWaypoints[1].id,
        ],
        meta: {
          [mockedWaypoints[0].id]: createMetaObject(),
          [mockedWaypoints[1].id]: createMetaObject(),
        },
      },
    };

    const splitStartAction = __testables__.splitStart({
      startIndex: 0,
      endIndex: 1,
      startId: mockedWaypoints[0].id,
      endId: mockedWaypoints[1].id,
    });

    it('should handle split start', () => {
      expect(reducer(updatedInitialState, splitStartAction)).toEqual({
        ...updatedInitialState,
        waypoints: {
          ...updatedInitialState.waypoints,
          meta: Object.entries(updatedInitialState.waypoints.meta)
            .reduce((prev, cur) => {
              const [key, meta] = cur;

              return {
                ...prev,
                [key]: {
                  ...meta,
                  disabled: true,
                  selected: false,
                },
              };
            }, {}),
          split: {
            newIds: [],
            enabled: true,
            start: {
              id: mockedWaypoints[0].id,
              index: 0,
            },
            end: {
              id: mockedWaypoints[1].id,
              index: 1,
            },
          }
        },
      });
    });

    it('should handle add, addBetween and remove actions in split mode', () => {
      const afterSplitStartState = reducer(updatedInitialState, splitStartAction);

      expect(afterSplitStartState.waypoints.split.enabled).toEqual(true);

      const newWaypoint = {
        id: '6533177a-9900-4900-a124-7d175d17ea7e',
        lat: 47.496056339,
        lng: 8.00028254,
      };

      const newWaypointBetween = {
        id: '372bd3d7-d670-4b17-9bd6-a8a6b19376f9',
        lat: 47.494823785,
        lng: 7.994762124,
      };

      /**
       * testing strategy: we only test changes in split sub-tree
       * since other sub-trees are tested with previous test cases
       */

      /**
       * test add action
       */
      const afterSplitAddState = reducer(
        afterSplitStartState,
        __testables__.add([newWaypoint])
      );
      expect(afterSplitAddState.waypoints.split).toEqual({
        ...afterSplitStartState.waypoints.split,
        newIds: [
          ...afterSplitStartState.waypoints.split.newIds,
          newWaypoint.id,
        ],
      });

      /**
       * test addBetween
       */
      const afterSplitAddBetweenState = reducer(
        afterSplitAddState,
        __testables__.addBetween(newWaypointBetween)
      );
      expect(afterSplitAddBetweenState.waypoints.split).toEqual({
        ...afterSplitAddState.waypoints.split,
        newIds: [
          ...afterSplitAddState.waypoints.split.newIds,
          newWaypointBetween.id,
        ],
      });

      /**
       * test remove
       */
      const afterSplitRemoveState = reducer(
        afterSplitAddBetweenState,
        __testables__.remove([newWaypoint.id]),
      );
      expect(afterSplitRemoveState.waypoints.split).toEqual({
        ...afterSplitAddBetweenState.waypoints.split,
        newIds: afterSplitAddBetweenState.waypoints.split.newIds
          .filter((id) => id !== newWaypoint.id),
      });
    });

    it('should not handle add, addBetween and remove actions if not in split mode', () => {
      expect(initialState.waypoints.split.enabled).toEqual(false);

      const newWaypoint = {
        id: '6533177a-9900-4900-a124-7d175d17ea7e',
        lat: 47.496056339,
        lng: 8.00028254,
      };

      const newWaypointBetween = {
        id: '372bd3d7-d670-4b17-9bd6-a8a6b19376f9',
        lat: 47.494823785,
        lng: 7.994762124,
      };

      /**
       * no changes should be seen in state as split mode
       * is disabled.
       */

      /**
       * test add action
       */
      const afterSplitAddState = reducer(
        initialState,
        __testables__.add([newWaypoint])
      );
      expect(afterSplitAddState.waypoints.split).toEqual({
        ...initialState.waypoints.split,
      });

      /**
       * test addBetween
       */
      const afterSplitAddBetweenState = reducer(
        afterSplitAddState,
        __testables__.addBetween(newWaypointBetween)
      );
      expect(afterSplitAddBetweenState.waypoints.split).toEqual({
        ...afterSplitAddState.waypoints.split,
      });

      /**
       * test remove
       */
      const afterSplitRemoveState = reducer(
        afterSplitAddBetweenState,
        __testables__.remove([newWaypoint.id]),
      );
      expect(afterSplitRemoveState.waypoints.split).toEqual({
        ...afterSplitAddBetweenState.waypoints.split,
      });
    });

    it('should handle split confirm after add', () => {
      const afterSplitStartState = reducer(updatedInitialState, splitStartAction);

      expect(afterSplitStartState.waypoints.split.enabled).toEqual(true);

      const newWaypoint = {
        id: '6533177a-9900-4900-a124-7d175d17ea7e',
        lat: 47.496056339,
        lng: 8.00028254,
      };

      const afterSplitAddState = reducer(
        afterSplitStartState,
        __testables__.add([newWaypoint])
      );
      expect(afterSplitAddState.waypoints.split).toEqual({
        ...afterSplitStartState.waypoints.split,
        newIds: [
          ...afterSplitStartState.waypoints.split.newIds,
          newWaypoint.id,
        ],
      });

      const action = __testables__.splitConfirm({
        newIds: afterSplitStartState.waypoints.split.newIds,
        start: afterSplitStartState.waypoints.split.start,
        end: afterSplitStartState.waypoints.split.end,
      });

      const afterSplitConfirmState = reducer(afterSplitAddState, action);
      expect(afterSplitConfirmState.waypoints).toEqual({
        ...afterSplitAddState.waypoints,
        /**
         * ensure waypoint items are no longer disabled
         */
        meta: Object.entries(afterSplitAddState.waypoints.meta).reduce((prev, cur) => {
          const [key, value] = cur;
          return {
            ...prev,
            [key]: {
              ...value,
              disabled: false,
            },
          };
        }, {}),
        /**
         * split should be back on initial state
         */
        split: __testables__.splitReducerInitialState,
      });
    });

    it('should handle split cancel after add', () => {
      const afterSplitStartState = reducer(updatedInitialState, splitStartAction);

      expect(afterSplitStartState.waypoints.split.enabled).toEqual(true);

      const newWaypoint = {
        id: '6533177a-9900-4900-a124-7d175d17ea7e',
        lat: 47.496056339,
        lng: 8.00028254,
      };

      const afterSplitAddState = reducer(
        afterSplitStartState,
        __testables__.add([newWaypoint])
      );
      expect(afterSplitAddState.waypoints.split).toEqual({
        ...afterSplitStartState.waypoints.split,
        newIds: [
          ...afterSplitStartState.waypoints.split.newIds,
          newWaypoint.id,
        ],
      });

      const { newIds } = afterSplitAddState.waypoints.split;
      const action = __testables__.splitCancel(newIds);

      const afterSplitCancelState = reducer(afterSplitAddState, action);
      expect(afterSplitCancelState.waypoints).toEqual({
        ...afterSplitAddState.waypoints,
        /**
         * ensure newly added waypoints are removed again
         */
        byId: {
          ...afterSplitStartState.waypoints.byId,
        },
        ids: [
          ...afterSplitStartState.waypoints.ids,
        ],
        /**
         * ensure newly added waypoints are removed and
         * all other waypoints are no longer disabled
         */
        meta: Object.entries(afterSplitAddState.waypoints.meta)
          .filter(([id]) => !newIds.includes(id))
          .reduce((prev, cur) => {
            const [id, value] = cur;
            return {
              ...prev,
              [id]: {
                ...value,
                disabled: false,
              },
            };
          }, {}),
        /**
         * split should be back on initial state
         */
        split: __testables__.splitReducerInitialState,
      });
    });
  });
});
