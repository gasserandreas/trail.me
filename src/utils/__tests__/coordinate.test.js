import * as coordinate from '../coordinate';

describe('utils/coordinate test suite', () => {
  const mockedCoordinate = '47.488399203184954';

  it('should return empty string for invalid text', () => {
    expect(coordinate.shortenCoordinate(null)).toEqual('');
  });

  it('should return shorten coordinate', () => {
    const expectedValue = '47.48839';
    expect(coordinate.shortenCoordinate(mockedCoordinate)).toEqual(expectedValue);
  });
});
