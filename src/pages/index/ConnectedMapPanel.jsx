import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MapPanel from '../../ui/Panels/MapPanel/MapPanel';

import { setViewport, setLocation, setActionType } from '../../entities/map';
import { invertWaypoints } from '../../entities/waypoints';
import { viewportSelector, actionTypeSelector } from '../../entities/map/selector';

const ConnectedMapPanel = () => {
  const dispatch = useDispatch();
  const viewport = useSelector(viewportSelector);
  const actionType = useSelector(actionTypeSelector);

  const center = useMemo(() => viewport.center, [viewport]);

  const handleOnCenterChange = (_, newCenter) => {
    const newViewport = {
      ...viewport,
      center: newCenter,
    };
    dispatch(setViewport(newViewport));
  };

  const handleOnLocationUpdate = (_, newLocation) => {
    dispatch(setLocation(newLocation));
  };

  const handleOnMapActionChange = (_, newActionType) => {
    dispatch(setActionType(newActionType));
  };

  const handleOnCustomActionClick = (_, customActionKey) => {
    switch (customActionKey) {
      default:
        dispatch(invertWaypoints());
    }
  };

  return (
    <MapPanel
      center={center}
      mapAction={actionType}
      onCenterChange={handleOnCenterChange}
      onMapActionChange={handleOnMapActionChange}
      onLocationUpdate={handleOnLocationUpdate}
      onCustomActionClick={handleOnCustomActionClick}
    />
  );
};

export default ConnectedMapPanel;
