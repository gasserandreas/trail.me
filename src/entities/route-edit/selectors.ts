import { createSelector } from 'reselect';

import RootState from '../../config/redux/rootType';
import RouteEditState, { WaypointsState } from './types';

export const routeEditStateSelector = (state: RootState): RouteEditState => state.routeEdit;

export const actionTypeSelector = createSelector(
  routeEditStateSelector,
  ({ actionType }) => actionType,
);

export const multiSelectSelector = createSelector(
  routeEditStateSelector,
  ({ multiSelect }) => multiSelect,
);

/**
 * waypoint selectors
 */
const waypointsStateSelector = createSelector(routeEditStateSelector, ({ waypoints }) => waypoints);

export const waypointsByIdSelector = createSelector(waypointsStateSelector, ({ byId }) => byId);

export const waypointsIdsSelector = createSelector(waypointsStateSelector, ({ ids }) => ids);

export const waypointsSelector = createSelector(waypointsStateSelector, ({ byId, ids }) => {
  if (ids.length === 0) {
    return [];
  }

  return ids.map((id: GUID) => byId[id]).filter(Boolean);
});

/**
 * meta selectors
 */

export const metaStateSelector = createSelector<
  RootState,
  WaypointsState,
  Record<GUID, WaypointMeta>
>(waypointsStateSelector, ({ meta }) => meta);

export const selectedWaypointIdsSelector = createSelector<
  RootState,
  Record<GUID, WaypointMeta>,
  string[]
>(
  metaStateSelector,
  (meta) =>
    Object.entries(meta)
      .map((obj) => {
        const [id, data] = obj;
        const { selected } = data;

        if (selected) {
          return id;
        }

        return undefined;
      })
      .filter((item) => item !== undefined) as string[],
);

/**
 * split selectors
 */
export const splitStateSelector = createSelector(waypointsStateSelector, ({ split }) => split);

const splitStartSelector = createSelector(splitStateSelector, ({ start }) => start);

const splitEndSelector = createSelector(splitStateSelector, ({ end }) => end);

export const splitEnabledSelector = createSelector(splitStateSelector, ({ enabled }) => enabled);

const splitNewIdsSelector = createSelector(splitStateSelector, ({ newIds }) => newIds);

/**
 * combined selector
 */
export const waypointsPolylinesByIdSelector = createSelector(
  waypointsStateSelector,
  splitEnabledSelector,
  splitEndSelector,
  ({ byId, ids, meta }, enabled, splitEnd) => {
    if (ids.length === 0 || ids.length === 1) return [];

    const polylinesById: Record<GUID, Polyline> = {};

    const splitIndex = ids.indexOf(splitEnd.id);
    const firstIds = enabled ? [...ids.slice(0, splitIndex)] : ids;
    const secondIds = enabled ? [...ids.slice(splitIndex)] : [];

    [firstIds, secondIds].forEach((waypointIds) => {
      let lastWaypoint: Waypoint | null = null;

      waypointIds.forEach((id) => {
        const coordinate = byId[id];

        if (lastWaypoint) {
          const polyline: Polyline = {
            startWaypointId: lastWaypoint.id,
            endWaypointId: id,
            startPosition: {
              lat: lastWaypoint.lat,
              lng: lastWaypoint.lng,
            },
            endPosition: {
              lat: coordinate.lat,
              lng: coordinate.lng,
            },
            // selected if both coordinates are selected
            selected: meta[lastWaypoint.id].selected && meta[id].selected,
            disabled: meta[lastWaypoint.id].disabled && meta[id].disabled,
          };
          polylinesById[lastWaypoint.id] = polyline;
        }

        // save last coordinate for reference
        lastWaypoint = coordinate;
      });
    });

    return polylinesById;
  },
);

export const waypointsIdsForListSelector = createSelector(
  waypointsIdsSelector,
  splitEnabledSelector,
  splitNewIdsSelector,
  (waypointIds, enabled, newIds) => {
    if (enabled) {
      return newIds;
    }

    return waypointIds;
  },
);

/* eslint-disable @typescript-eslint/naming-convention */
export const __testables__ = {
  waypointsStateSelector,
  splitStartSelector,
  splitEndSelector,
  splitNewIdsSelector,
};
