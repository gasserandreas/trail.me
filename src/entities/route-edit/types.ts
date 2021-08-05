export type ActionTypeState = string;

export type MultiSelectState = boolean;

export type WaypointsState = {
  byId: Record<GUID, Waypoint>;
  ids: Array<GUID>;
  meta: Record<GUID, WaypointMeta>;
  split: WaypointSplit;
};

export type RouteState = {
  id: GUID;
  name: string;
};

export type RootState = {
  actionType: ActionTypeState;
  multiSelect: MultiSelectState;
  waypoints: WaypointsState;
  route: RouteState;
};

export default RootState;
