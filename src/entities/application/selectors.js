import { createSelector } from 'reselect';

export const applicationStateSelector = (state) => state.application;

export const applicationUserSelector = createSelector(
  applicationStateSelector,
  ({ user }) => user,
);

export const applicationStatusSelector = createSelector(
  applicationStateSelector,
  ({ status }) => status,
);
