import * as selectors from '../selectors';

import { TESTABLES as editRouteTestables } from '../index';
import { createMetaObject } from '../utils';

import mockedWaypoints from '../__data__/mockedWaypoints.json';
import MapActions from '../../../constants/MapActions';

const state = {
  routeEdit: {
    actionType: MapActions.SELECT,
    multiSelect: false,
    waypoints: {
      byId: mockedWaypoints.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.id]: cur,
        }),
        {},
      ),
      ids: mockedWaypoints.map(({ id }) => id),
      meta: mockedWaypoints.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.id]: createMetaObject(),
        }),
        {},
      ),
      split: {
        ...editRouteTestables.splitReducerInitialState,
      },
    },
    route: {
      name: 'new route name',
      id: '7d5c7cc5-6549-476e-834f-05e5ca5afca8',
    },
  },
};

describe('entities/editRoute/selectors test suite', () => {
  it('actionTypeSelector should return actionType', () => {
    expect(selectors.actionTypeSelector(state)).toEqual(state.routeEdit.actionType);
  });

  it('multiSelectSelector should return multiSelect', () => {
    expect(selectors.multiSelectSelector(state)).toEqual(state.routeEdit.multiSelect);
  });

  it('waypointsStateSelector should return waypoints', () => {
    expect(selectors.TESTABLES.waypointsStateSelector(state)).toEqual(
      state.routeEdit.waypoints,
    );
  });

  it('waypointsByIdSelector should return waypoints byId', () => {
    expect(selectors.waypointsByIdSelector(state)).toEqual(state.routeEdit.waypoints.byId);
  });

  it('waypointsIdsSelector should return waypoints ids', () => {
    expect(selectors.waypointsIdsSelector(state)).toEqual(state.routeEdit.waypoints.ids);
  });

  it('waypointsSelector should return waypoints list', () => {
    expect(selectors.waypointsSelector(state)).toEqual(mockedWaypoints);

    const updatedState = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          ids: [],
        },
      },
    };
    expect(selectors.waypointsSelector(updatedState)).toEqual([]);
  });

  it('metaStateSelector should return meta state', () => {
    expect(selectors.metaStateSelector(state)).toEqual(state.routeEdit.waypoints.meta);
  });

  it('selectedWaypointIdsSelector should return selected waypoint ids', () => {
    const updatedState = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          meta: {
            ...state.routeEdit.waypoints.meta,
            [mockedWaypoints[0].id]: {
              ...createMetaObject(),
              selected: true,
            },
          },
        },
      },
    };
    expect(selectors.selectedWaypointIdsSelector(updatedState)).toEqual(
      Object.entries(updatedState.routeEdit.waypoints.meta)
        .filter(([_, meta]) => meta.selected) // eslint-disable-line no-unused-vars
        .map(([id]) => id),
    );
  });

  it('splitStateSelector should return split state', () => {
    expect(selectors.splitStateSelector(state)).toEqual(state.routeEdit.waypoints.split);
  });

  it('splitStartSelector should return split start state', () => {
    expect(selectors.TESTABLES.splitStartSelector(state)).toEqual(
      state.routeEdit.waypoints.split.start,
    );
  });

  it('splitEndSelector should return split end state', () => {
    expect(selectors.TESTABLES.splitEndSelector(state)).toEqual(
      state.routeEdit.waypoints.split.end,
    );
  });

  it('splitEnabledSelector should return split enabled state', () => {
    expect(selectors.splitEnabledSelector(state)).toEqual(state.routeEdit.waypoints.split.enabled);
  });

  it('splitNewIdsSelector should return split newIds state', () => {
    expect(selectors.TESTABLES.splitNewIdsSelector(state)).toEqual(
      state.routeEdit.waypoints.split.newIds,
    );
  });

  it('waypointsPolylinesByIdSelector should return polyline state', () => {
    expect(selectors.waypointsPolylinesByIdSelector(state)).toMatchSnapshot();

    /**
     * check for empty ids array
     */
    const updatedState1 = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          ids: [],
        },
      },
    };

    expect(selectors.waypointsPolylinesByIdSelector(updatedState1)).toMatchSnapshot();

    /**
     * check for ids array with only one item
     */
    const updatedState2 = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          ids: [],
        },
      },
    };

    expect(selectors.waypointsPolylinesByIdSelector(updatedState2)).toMatchSnapshot();

    /**
     * check for split enabled state
     */
    const updatedState3 = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          split: {
            ...state.routeEdit.waypoints.split,
            enabled: true,
          },
        },
      },
    };

    expect(selectors.waypointsPolylinesByIdSelector(updatedState3)).toMatchSnapshot();

    /**
     * check for split enabled state
     */
    const updatedState4 = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          split: {
            ...state.routeEdit.waypoints.split,
            enabled: true,
          },
          meta: {
            ...state.routeEdit.waypoints.meta,
            [mockedWaypoints[0].id]: {
              selected: true,
            },
            [mockedWaypoints[1].id]: {
              disabled: true,
            },
          },
        },
      },
    };

    expect(selectors.waypointsPolylinesByIdSelector(updatedState4)).toMatchSnapshot();
  });

  it('waypointsIdsForListSelector should return ids list', () => {
    expect(selectors.waypointsIdsForListSelector(state)).toEqual(state.routeEdit.waypoints.ids);

    const newIds = [mockedWaypoints[0].id, mockedWaypoints[1].id];
    const updatedState = {
      ...state,
      routeEdit: {
        ...state.routeEdit,
        waypoints: {
          ...state.routeEdit.waypoints,
          split: {
            ...state.routeEdit.waypoints.split,
            enabled: true,
            newIds,
          },
        },
      },
    };

    expect(selectors.waypointsIdsForListSelector(updatedState)).toEqual(
      updatedState.routeEdit.waypoints.split.newIds,
    );
  });
});
