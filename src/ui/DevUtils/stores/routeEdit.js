import MapActions from '../../../constants/MapActions';

import waypoints from '../data/waypoints.json';

const byId = {};
const ids = [];
const meta = {};

waypoints.forEach((coordinate) => {
  const { id } = coordinate;
  byId[id] = coordinate;
  meta[id] = {
    selected: false,
    disable: false,
  };
  ids.push(id);
});

export default {
  actionType: MapActions.SELECT,
  multiSelect: false,
  waypoints: {
    past: [],
    present: {
      byId,
      ids,
      meta,
    },
    future: [],
    _latestUnfiltered: {},
    index: 4,
    limit: 5,
  },
  route: {
    id: '',
    name: '',
  },
};
