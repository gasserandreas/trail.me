/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import jestFetchMock from 'jest-fetch-mock';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// setup enzyme
configure({ adapter: new Adapter() });

// setup fetch-mock
global.fetch = jestFetchMock;

// basic helpers
const createMockStore = (
  middleware = [
    // add your redux middleware here
    thunk,
  ],
) => configureMockStore(middleware);

// create and export testUtils
global.testUtils = {
  createMockStore,
};
