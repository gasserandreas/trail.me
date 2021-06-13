import * as selectors from '../selectors';
import { AppStatus } from '../index';

const state = {
  application: {
    user: {},
    status: AppStatus.INITIAL,
  },
};

it('application/selectors: applicationUserSelector should return user from state', () => {
  expect(selectors.applicationUserSelector(state)).toEqual(state.application.user);
});

it('application/selectors: applicationStatusSelector should return user from state', () => {
  expect(selectors.applicationStatusSelector(state)).toEqual(state.application.status);
});
