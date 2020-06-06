import waypoints from './waypoints.json';

const byId = {};
const ids = [];
const selected = {};

waypoints.forEach((coordinate) => {
  const { id } = coordinate;
  byId[id] = coordinate;
  selected[id] = { value: false };
  ids.push(id);
});

export default {
  waypoints: {
    pending: false,
    byId,
    ids,
    selected,
  },
};
