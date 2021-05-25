import reducer, {
  setViewport,
  setViewportCoordinates,
  setLocation,
  __testables__,
} from '../index';

const mockedViewport = {
  center: [
    47.50424339058062,
    8.026628494262697,
  ],
  zoom: 15,
};

describe('map: simple action test suite', () => {
  it('should create setViewport action', () => {
    expect(setViewport(mockedViewport)).toMatchSnapshot();
  });

  it('should create setViewportCoordinates action', () => {
    expect(setViewportCoordinates([47.0, 8.0])).toMatchSnapshot();
  });

  it('should create setLocation action', () => {
    expect(setLocation(mockedViewport.center)).toMatchSnapshot();
  });
});

describe('application: reducers test suite', () => {
  const initialState = {
    viewport: __testables__.FRICK_VIEWPORT,
    location: [],
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SET_VIEWPORT', () => {
    const action = setViewport(mockedViewport);

    expect(
      reducer(
        initialState,
        action,
      )
    ).toEqual({
      ...initialState,
      viewport: {
        center: mockedViewport.center,
        zoom: mockedViewport.zoom,
      },
    });
  });

  it('should handle SET_VIEWPORT_COORDINATES', () => {
    const action = setViewportCoordinates(mockedViewport.center);

    expect(
      reducer(
        initialState,
        action,
      )
    ).toEqual({
      ...initialState,
      viewport: {
        ...initialState.viewport,
        center: mockedViewport.center,
      },
    });
  });

  it('should handle SET_LOCATION', () => {
    const action = setLocation(mockedViewport.center);

    expect(
      reducer(
        initialState,
        action,
      )
    ).toEqual({
      ...initialState,
      location: mockedViewport.center,
    });
  });
});
