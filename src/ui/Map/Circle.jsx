import React from 'react';
import PropTypes from 'prop-types';
import { Circle as LCircle } from 'react-leaflet';

import { useTheme } from '@material-ui/core/styles';

const Circle = ({
  latlng, zoom, selected, ...props
}) => {
  const theme = useTheme();
  const { palette: { primary } } = theme;

  const circleCenter = [latlng.lat, latlng.lng];
  const radius = (102 - 5 * zoom);
  const color = selected ? primary.dark : primary.main;
  const fillOpacity = 1;

  return (
    <LCircle
      center={circleCenter}
      radius={radius}
      color={color}
      fillOpacity={fillOpacity}
      {...props}
      fill
    />
  );
};

Circle.propTypes = {
  latlng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number,
  selected: PropTypes.bool,
};

Circle.defaultProps = {
  zoom: 13,
  selected: false,
};

export default Circle;
