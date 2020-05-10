import { createSelector } from 'reselect';

export const waypointsStateSelector = (state) => state.waypoints;

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
  ({ byId, ids, selected }) => {
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
          selected: selected[lastCoordinate.id] && selected[id],
        };

        newPolylines.push(polyline);
      }

      // save last coordinate for reference
      lastCoordinate = coordinate;
    });

    return newPolylines;
  }
);

export const selectedWaypointsSelector = createSelector(
  waypointsStateSelector,
  ({ selected }) => selected,
);

export const selectedWaypointIdsSelector = createSelector(
  selectedWaypointsSelector,
  (selectedById) => Object.entries(selectedById)
    .map(([id, boolean]) => {
      if (boolean) {
        return id;
      }
      return undefined;
    })
    .filter(Boolean)
);

export const waypointsPendingSelector = createSelector(
  waypointsStateSelector,
  ({ pending }) => pending,
);
