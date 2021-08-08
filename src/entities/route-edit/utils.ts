import * as uuid from 'uuid';

export function createWaypoints(waypoints: Array<Waypoint> = []): {
  byId: { [key: string]: Waypoint };
  ids: Array<GUID>;
} {
  const byId: { [key: string]: Waypoint } = {};
  const ids: Array<GUID> = [];

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

export function createWaypoint(data: {
  lat: Latitude;
  lng: Longitude;
  time?: string;
  elevation?: string;
}): Waypoint {
  return {
    id: uuid.v4(),
    ...data,
  };
}

export function createMetaObject(
  initialMeta: {
    selected: boolean;
    disabled: boolean;
  } = {
    selected: false,
    disabled: false,
  },
): WaypointMeta {
  return initialMeta;
}
