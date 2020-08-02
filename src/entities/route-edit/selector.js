import { createSelector } from 'reselect';

export const routeEditStateSelector = (state) => state.routeEdit;

export const actionTypeSelector = createSelector(
  routeEditStateSelector,
  ({ actionType }) => actionType,
);

export const fileTypeSelector = createSelector(
  routeEditStateSelector,
  ({ fileType }) => fileType,
);

export const multiSelectSelector = createSelector(
  routeEditStateSelector,
  ({ multiSelect }) => multiSelect,
);

/**
 * waypoint selectors
 */
export const waypointsStateSelector = createSelector(
  routeEditStateSelector,
  ({ waypoints }) => waypoints,
);

export const waypointsByIdSelector = createSelector(
  waypointsStateSelector,
  ({ byId }) => byId,
);

export const waypointsIdsSelector = createSelector(
  waypointsStateSelector,
  ({ ids }) => ids,
);

export const waypointsSelector = createSelector(
  waypointsStateSelector,
  ({ byId, ids }) => {
    if (ids.length === 0) {
      return [];
    }

    return ids.map((id) => byId[id])
      .filter(Boolean);
  }
);

/**
 * meta selectors
 */

export const metaStateSelector = createSelector(
  waypointsStateSelector,
  ({ meta }) => meta,
);

export const selectedWaypointIdsSelector = createSelector(
  metaStateSelector,
  (meta) => Object.entries(meta)
    .map(([id, data]) => {
      const { selected } = data;

      if (selected) {
        return id;
      }

      return undefined;
    })
    .filter(Boolean),
);

/**
 * split selectors
 */
export const splitStateSelector = createSelector(
  waypointsStateSelector,
  ({ split }) => split,
);

export const splitStartSelector = createSelector(
  splitStateSelector,
  ({ start }) => start,
);

export const splitEndSelector = createSelector(
  splitStateSelector,
  ({ end }) => end,
);

export const splitEnabledSelector = createSelector(
  splitStateSelector,
  ({ enabled }) => enabled,
);

export const splitNewIdsSelector = createSelector(
  splitStateSelector,
  ({ newIds }) => newIds,
);

/**
 * combined selector
 */
export const waypointsPolylinesSelector = createSelector(
  waypointsStateSelector,
  splitEnabledSelector,
  splitNewIdsSelector,
  splitStartSelector,
  splitEndSelector,
  ({ byId, ids, meta }, enabled, newIds, splitStart, splitEnd) => {
    if (ids.length === 0 || ids.length === 1) return [];

    const newPolylines = [];

    const splitIndex = ids.indexOf(splitEnd.id);
    const firstIds = enabled ? [...ids.slice(0, splitIndex)] : ids;
    const secondIds = enabled ? [...ids.slice(splitIndex)] : [];

    [firstIds, secondIds].forEach((waypointIds) => {
      let lastCoordinate = null;

      waypointIds.forEach((id) => {
        const coordinate = byId[id];

        if (lastCoordinate) {
          const polyline = {
            startCoordinateId: lastCoordinate.id,
            endCoordinateId: id,
            startPosition: {
              lat: lastCoordinate.lat,
              lng: lastCoordinate.lng,
            },
            endPosition: {
              lat: coordinate.lat,
              lng: coordinate.lng,
            },
            // selected if both coordinates are selected
            selected: meta[lastCoordinate.id].selected && meta[id].selected,
            disabled: meta[lastCoordinate.id].disabled && meta[id].disabled,
          };
          newPolylines.push(polyline);
        }

        // save last coordinate for reference
        lastCoordinate = coordinate;
      });
    });

    return newPolylines;
  }
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

export const waypointsPendingSelector = () => false;
