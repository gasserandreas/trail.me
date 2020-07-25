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

export const waypointsPolylinesSelector = createSelector(
  waypointsStateSelector,
  ({ byId, ids, meta }) => {
    if (ids.length === 0 || ids.length === 1) return [];

    let lastCoordinate = null;
    const newPolylines = [];

    ids.forEach((id) => {
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
        };

        newPolylines.push(polyline);
      }

      // save last coordinate for reference
      lastCoordinate = coordinate;
    });

    return newPolylines;
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

export const waypointsPendingSelector = () => false;
