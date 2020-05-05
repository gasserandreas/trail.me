import React from 'react';
import PropTypes from 'prop-types';
import { CRS } from 'leaflet';
import { Map, TileLayer } from 'react-leaflet';

const SWISS_GEO_URL = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg'; // eslint-disable-line max-len

export const FRICK_VIEWPORT = {
  center: [47.50756, 8.02017],
  zoom: 15,
};

const SwissGeoMap = React.forwardRef(({ noStyles, children, ...props }, ref) => {
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
    <Map
      csr={CRS.EPSG3857}
      worldCopyJump={false}
      {...newProps}
      ref={ref}
    >
      <TileLayer url={SWISS_GEO_URL} />
      {children}
    </Map>
  );
});

SwissGeoMap.propTypes = {
  noStyles: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

SwissGeoMap.defaultProps = {
  noStyles: false,
};

export default SwissGeoMap;
