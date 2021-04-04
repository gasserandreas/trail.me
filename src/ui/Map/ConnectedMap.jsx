import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import { useMapEvents } from 'react-leaflet';

import { setViewport } from '../../entities/map';
import { viewportSelector } from '../../entities/map/selectors';

import {
  addWaypoint,
  addWaypointBetween,
} from '../../entities/route-edit';

import {
  actionTypeSelector,
  waypointsIdsSelector,
  splitStateSelector,
} from '../../entities/route-edit/selector';

import SwissGeoMap from './SwissGeoMap';
import ConnectedCircle from './circles/connected';
import ConnectedPolyline from './polylines/connected';

import MapActions from '../../constants/MapActions';

const ZOOM_HIDE_LEVEL = 14;

const ConnectedMap = () => {
  const dispatch = useDispatch();

  const actionType = useSelector(actionTypeSelector);

  const waypointIds = useSelector(waypointsIdsSelector);
  const splitMeta = useSelector(splitStateSelector);

  // handle map viewport
  const viewport = useSelector(viewportSelector);
  const { zoom, center } = viewport;

  const showCircles = useMemo(() => zoom >= ZOOM_HIDE_LEVEL, [zoom]);

  const handleOnViewportChanged = (newViewport) => {
    dispatch(setViewport(newViewport));
  };

  // map action handlers
  const handleOnMapClick = (e) => {
    const { latlng } = e;

    switch (actionType) {
      case MapActions.ADD:
        if (splitMeta.enabled) {
          /**
           * add new waypoints in between in split mode
           */
          const endIndex = waypointIds.indexOf(splitMeta.end.id);

          const startId = waypointIds[endIndex - 1];
          const endId = waypointIds[endIndex];

          dispatch(addWaypointBetween(latlng, startId, endId));
        } else {
          dispatch(addWaypoint(latlng));
        }
        break;
      default:
    }
  };

  const circleItems = useMemo(() => waypointIds.map((id) => (
    showCircles && <ConnectedCircle key={`waypoint-circle-${id}`} id={id} />
  )), [waypointIds, showCircles]);

  const polylinesItems = useMemo(() => waypointIds.map((id) => (
    <ConnectedPolyline key={`waypoint-polyline-${id}`} id={id} />
  )), [waypointIds, splitMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SwissGeoMap
      zoom={zoom}
      center={center}
      onViewportChanged={handleOnViewportChanged}
      onClick={handleOnMapClick}
      doubleClickZoom={false}
      mapAction={actionType}
    >
      {polylinesItems}
      {circleItems}
    </SwissGeoMap>
  );
};

export default ConnectedMap;
