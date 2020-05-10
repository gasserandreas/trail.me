import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addWaypoint } from '../../../entities/waypoints';

import { setViewport } from '../../../entities/map';
import { viewportSelector, actionTypeSelector } from '../../../entities/map/selector';

import SwissGeoMap from '../../../ui/Map/SwissGeoMap';

import ConnectedCircles from './ConnectedCircles';
import ConnectedPolylines from './ConnectedPolylines';

import MapActions from '../../../constants/MapActions';

const ConnectedMap = () => {
  const dispatch = useDispatch();
  const actionType = useSelector(actionTypeSelector);

  // handle map viewport
  const viewport = useSelector(viewportSelector);
  const handleOnViewportChanged = (newViewport) => {
    dispatch(setViewport(newViewport));
  };

  // map action handlers
  const handleMapClick = (e) => {
    const { latlng } = e;

    switch (actionType) {
      case MapActions.ADD:
        dispatch(addWaypoint(latlng));
        break;
      default:
    }
  };

  return (
    <SwissGeoMap
      viewport={viewport}
      onViewportChanged={handleOnViewportChanged}
      onClick={handleMapClick}
      doubleClickZoom={false}
    >
      <ConnectedPolylines />
      <ConnectedCircles />
    </SwissGeoMap>
  );
};

export default ConnectedMap;
