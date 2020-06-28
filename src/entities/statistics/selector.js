import { createSelector } from 'reselect';

import { waypointsIdsSelector } from '../waypoints/selector';

export const statisticsStateSelector = (state) => state.statistics;

export const statisticsDistancePrevByIdSelector = createSelector(
  statisticsStateSelector,
  (state) => state.prevDistance,
);

export const statisticsDistanceSelector = createSelector(
  statisticsDistancePrevByIdSelector,
  (nextById) => Object.values(nextById)
    .filter((val) => val !== null)
    .reduce((prev, cur) => prev + cur, 0),
);

export const statisticsNumberOfCoordinatesSelector = createSelector(
  waypointsIdsSelector,
  (ids) => ids.length,
);

export const statisticsPendingSelector = createSelector(
  statisticsStateSelector,
  (state) => state.pending,
);
