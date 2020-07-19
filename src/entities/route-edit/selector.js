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
