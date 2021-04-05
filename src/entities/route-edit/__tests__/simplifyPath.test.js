import simplify from '../simplifyPath';
import mockedWaypoints from '../__data__/waypoints-simplify.json';

describe('entities/routeEdit/simplifyPath test suite', () => {
  const TOLERANCE = 0.00015;

  it('should simplify big json route', () => {
    expect(simplify(mockedWaypoints, TOLERANCE, true))
      .toMatchSnapshot();

    expect(simplify(mockedWaypoints, TOLERANCE, false))
      .toMatchSnapshot();
  });

  it('should return original points if only two are specified', () => {
    const waypoints = [
      mockedWaypoints[0],
      mockedWaypoints[1],
    ];

    expect(simplify(waypoints)).toEqual(waypoints);
  });
});
