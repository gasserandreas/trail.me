import { createSelector } from 'reselect';

export const mapStateSelector = (state) => state.map;

export const viewportSelector = createSelector(
  mapStateSelector,
  ({ viewport }) => viewport,
);

export const locationSelector = createSelector(
  mapStateSelector,
  ({ location }) => location,
);
