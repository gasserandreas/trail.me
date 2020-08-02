import { createSelector } from 'reselect';

// import { waypointsIdsSelector } from '../waypoints/selector';

export const statisticsStateSelector = (state) => state.statistics;

export const statisticsDistancePrevByIdSelector = createSelector(
  statisticsStateSelector,
  (state) => state.prevDistance,
);

export const statisticsDistanceSelector = createSelector(
  statisticsDistancePrevByIdSelector,
  (prevById) => Object.values(prevById)
    .filter((val) => val !== null)
    .reduce((prev, cur) => prev + cur, 0),
);

// export const statisticsNumberOfCoordinatesSelector = createSelector(
//   waypointsIdsSelector,
//   (ids) => ids.length,
// );

export const statisticsNumberOfCoordinatesSelector = () => 0;

export const statisticsPendingSelector = createSelector(
  statisticsStateSelector,
  (state) => state.pending,
);

export const statisticsTimeSelector = createSelector(
  statisticsStateSelector,
  (state) => state.time,
);

export const statisticsHeightSelector = createSelector(
  statisticsStateSelector,
  (state) => state.height,
);

export const statisticsShouldBeShown = createSelector(
  statisticsDistancePrevByIdSelector,
  statisticsTimeSelector,
  statisticsHeightSelector,
  (prevById, time, height) => (
    Object.keys(prevById).length > 1
    || time.start
    || time.end
    || time.total
    || height.up
    || time.down
  )
);
