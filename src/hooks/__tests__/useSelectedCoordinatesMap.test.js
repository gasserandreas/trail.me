import { renderHook } from '@testing-library/react-hooks';

import useSelectedCoordinatesMap from '../useSelectedCoordinatesMap';

describe('hooks/useSelectedCoordinatesMap test utils', () => {
  const selectedWaypoint = '4f72ec93-d59c-4084-8822-01e78ce38a84';

  const waypoints = [
    {
      id: '4f72ec93-d59c-4084-8822-01e78ce38a84',
      lat: 47.50424,
      lng: 8.026628,
      elevation: 100,
      time: '2020-08-07T07:36:55Z',
    },
    {
      id: 'c4cd3414-fa91-48dd-a814-080e9f1c4802',
      lat: 47.50423,
      lng: 8.026627,
      elevation: 0,
      time: '',
    },
    {
      id: '3023a7b8-f6f4-40a5-8730-0a4ab1f2caca',
      lat: 45.50424,
      lng: 7.026628,
      elevation: 150,
      time: '2020-10-07T07:36:55Z',
    },
  ];

  it('should create and update selected coordinates dictionary', () => {
    const { result } = renderHook(() => useSelectedCoordinatesMap(waypoints, [selectedWaypoint]));

    // const { current } = result;

    expect(result.current).toEqual({
      '4f72ec93-d59c-4084-8822-01e78ce38a84': true,
      'c4cd3414-fa91-48dd-a814-080e9f1c4802': false,
      '3023a7b8-f6f4-40a5-8730-0a4ab1f2caca': false,
    });
  });
});
