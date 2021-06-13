import * as uuid from 'uuid';

export function createWaypoints(waypoints = []) {
  const byId = {};
  const ids = [];

  waypoints.forEach((waypoint) => {
    const id = waypoint.id || uuid.v4();
    byId[id] = {
      ...waypoint,
      id,
    };
    ids.push(id);
  });

  return {
    byId,
    ids,
  };
}

export function createWaypoint(data) {
  return {
    id: uuid.v4(),
    ...data,
  };
}

export function createMetaObject(
  id,
  initialMeta = {
    selected: false,
    disabled: false,
  },
) {
  return initialMeta;
}
