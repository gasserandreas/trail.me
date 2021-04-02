import * as geolocation from '../geolocation';

describe('utils/geolocation test suite', () => {
  let originalGeolocation;

  const mockedError = 'getLocation error';

  const mockedGeolocation = {
    getCurrentPosition: jest.fn(),
  };

  beforeAll(() => {
    originalGeolocation = { ...global.navigator.geolocation };
    global.navigator.geolocation = mockedGeolocation;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.navigator.geolocation = originalGeolocation;
  });

  it('should return error promise', async () => {
    global.navigator.geolocation.getCurrentPosition
      .mockImplementationOnce((_, error) => error(mockedError));

    try {
      await geolocation.getLocation();
    } catch (error) {
      expect(error).toEqual(mockedError);
    }
  });

  it('should return success promise', async () => {
    const mockedCoords = {
      latitude: 51.1,
      longitude: 45.3
    };

    global.navigator.geolocation.getCurrentPosition
      .mockImplementationOnce((success) => success(mockedCoords));

    const location = await geolocation.getLocation();
    expect(location).toEqual(mockedCoords);
  });

  it('should fail if not geolocation is set', async () => {
    global.navigator = {};

    /**
     * delete geolocation property
     */
    delete global.navigator.geolocation;

    try {
      await geolocation.getLocation();
    } catch (error) {
      expect(error.message).toEqual('Geolocation is not supported / enabled');
    }
  });
});
