type GUID = string;

type GUIDArray = Array<GUID>;

type Latitude = number;
type Longitude = number;

type Dictionary<K, V> = {
  [key: K]: V;
};

type Waypoint = {
  id: GUID;
  lat: Latitude;
  lng: Longitude;
  time?: string;
  elevation: string;
};

type WaypointMeta = {
  selected: boolean;
  disabled: boolean;
};

type WaypointSplit = {
  enabled: boolean;
  start: {
    id: GUID;
    index: number;
  };
  end: {
    id: GUID;
    index: number;
  };
  newIds: Array<GUID>;
};

type Position = {
  lat: Latitude;
  lng: Longitude;
};

type Polyline = {
  startWaypointId: GUID;
  endWaypointId: GUID;
  startPosition: Position;
  endPosition: Position;
  selected: boolean;
  disabled: boolean;
};
