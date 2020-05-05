import React from 'react';
import PropTypes from 'prop-types';
import { Polyline as LPolyline } from 'react-leaflet';

import { useTheme } from '@material-ui/core/styles';

const Polyline = ({
  startLatlng, endLatlng, zoom, selected, ...props
}) => {
  const theme = useTheme();
  const { palette: { primary } } = theme;

  const weight = 8;
  const color = selected ? primary.dark : primary.main;
  const fillOpacity = 1;

  return (
    <LPolyline
      weight={weight}
      positions={[
        [startLatlng.lat, startLatlng.lng],
        [endLatlng.lat, endLatlng.lng]
      ]}
      color={color}
      fillOpacity={fillOpacity}
      {...props}
      fill
    />
  );
};

Polyline.propTypes = {
  startLatlng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  endLatlng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

Polyline.defaultProps = {
  zoom: 13,
  selected: false,
  onClick: null,
};

export default Polyline;
