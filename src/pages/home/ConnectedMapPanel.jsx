import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MapPanel from '../../ui/Panels/MapPanel/MapPanel';

import { setViewport, setLocation } from '../../entities/map';
import { viewportSelector } from '../../entities/map/selector';

import { setActionType, invertWaypoints } from '../../entities/route-edit';
import { actionTypeSelector } from '../../entities/route-edit/selector';

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
