import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { CRS } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  useMapEvent,
} from 'react-leaflet';

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
  noStyles, children, mapAction, onViewportChanged, onClick, zoom, center, ...props
}, ref) => {
  const classes = useStyles({ mapAction });

  const [map, setMap] = useState(null);
  /**
   * this is used to prevent moveend callbacks on map setView executions.
   * Explanation: leaflet automatically fires onMoveEnd / onMoveStart actions if viewport
   * is changed programmatically. This behavior leads into while-true loops since we are
   * also listening to onMoveEnd events for user drag actions.
   *
   * Direct value access through useRef is used to ensure flag is set BEFORE setView is
   * fired programmatically.
   */
  const disableMoveEndRef = useRef(false);

  useEffect(() => {
    if (map) {
      disableMoveEndRef.current = true;
      map.setView(center, zoom);
      disableMoveEndRef.current = false;
    }
  }, [zoom, center, map]);

  const onMoveend = useCallback(() => {
    /**
     * do not update if viewport was set programmatically
     */
    if (disableMoveEndRef?.current) {
      return;
    }

    const { lat, lng } = map.getCenter();
    const newZoom = map.getZoom();

    const viewport = {
      center: [lat, lng],
      zoom: newZoom,
    };

    onViewportChanged(viewport);
  }, [map, onViewportChanged]);

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
        zoom={zoom}
        center={center}
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
  children: PropTypes.node.isRequired,
  zoom: PropTypes.number.isRequired,
  center: PropTypes.shape({}).isRequired,
  noStyles: PropTypes.bool,
  mapAction: PropTypes.string,
};

SwissGeoMap.defaultProps = {
  noStyles: false,
  mapAction: MapActions.SELECT,
};

export default SwissGeoMap;
