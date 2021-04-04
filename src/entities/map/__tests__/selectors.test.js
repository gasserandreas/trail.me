import * as selectors from '../selectors';

import { __testables__ } from '../index';

const state = {
  map: {
    viewport: __testables__.FRICK_VIEWPORT,
    location: [],
  },
};

describe('entities/map/selectors test suite', () => {
  it('viewportSelector should return viewport state', () => {
    expect(selectors.mapStateSelector(state)).toEqual(state.map);
  });

  it('viewportSelector should return viewport state', () => {
    expect(selectors.viewportSelector(state)).toEqual(state.map.viewport);
  });

  it('locationSelector should return viewport state', () => {
    expect(selectors.locationSelector(state)).toEqual(state.map.location);
  });
});
