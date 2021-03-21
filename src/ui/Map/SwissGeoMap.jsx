import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CRS } from 'leaflet';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';

import { makeStyles } from '@material-ui/core';
import MapActions from '../../constants/MapActions';

const getMousePointer = (props) => {
  switch (props.mapAction) {
    case MapActions.ADD:
      return 'crosshair';
    default:
      return 'grab';
  }
};

const useStyles = makeStyles({
  map: (props) => ({
    '& .leaflet-container': {
      cursor: getMousePointer(props),
    },
  }),
});

const SWISS_GEO_URL = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg'; // eslint-disable-line max-len

export const FRICK_VIEWPORT = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

const ClickHandler = ({ onClick }) => {
  useMapEvent('click', onClick);
  return null;
};

const MoveHandler = ({ onMoveend }) => {
  useMapEvent('moveend', onMoveend);
  return null;
};

const SwissGeoMap = React.forwardRef(({
  noStyles, children, mapAction, onViewportChanged, onClick, ...props
}, ref) => {
  const classes = useStyles({ mapAction });

  const [map, setMap] = useState(null);

  const onMoveend = useCallback(() => {
    const { lat, lng } = map.getCenter();
    const zoom = map.getZoom();

    const viewport = {
      center: [lat, lng],
      zoom,
    };

    onViewportChanged(viewport);
  }, [map]);

  const newProps = {
    ...props,
  };

  if (!noStyles) {
    newProps.style = {
      width: '100%',
      height: '100%',
      margin: 0,
    };
  }

  return (
    <span className={classes.map}>
      <MapContainer
        csr={CRS.EPSG3857}
        worldCopyJump={false}
        whenCreated={setMap}
        {...newProps}
        ref={ref}
      >
        {map && (
          <>
            <TileLayer url={SWISS_GEO_URL} />
            <ClickHandler onClick={onClick} />
            <MoveHandler onMoveend={onMoveend} />
            {children}
          </>
        )}
      </MapContainer>
    </span>
  );
});

SwissGeoMap.propTypes = {
  onClick: PropTypes.func.isRequired,
  onViewportChanged: PropTypes.func.isRequired,
  noStyles: PropTypes.bool,
  children: PropTypes.node.isRequired,
  mapAction: PropTypes.string,
};

SwissGeoMap.defaultProps = {
  noStyles: false,
  mapAction: MapActions.SELECT,
};

export default SwissGeoMap;
