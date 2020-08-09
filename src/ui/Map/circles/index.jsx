import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Leaflet from 'leaflet';
import { Marker } from 'react-leaflet';

import { useTheme } from '@material-ui/core/styles';

const Circle = React.memo(({
  latlng, selected, disabled, ...props
}) => {
  const theme = useTheme();
  const { palette } = theme;
  const { primary } = palette;

  function getColor(isSelected, isDisabled) {
    if (isDisabled) {
      return palette.grey[400];
    }

    return isSelected ? primary.dark : primary.main;
  }

  const circleCenter = [latlng.lat, latlng.lng];
  const radius = 26;
  const color = getColor(selected, disabled);

  const circleIcon = useMemo(() => Leaflet.divIcon({
    iconSize: [radius, radius],
    iconAnchor: [radius / 2, radius / 2],
    className: '',
    // eslint-disable-next-line max-len
    html: `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>
          <circle cx='50' cy='50' r='40' fill='${color}' stroke='rgba(0,0,0,0.7)' stroke-width='5'></circle>
        </svg>`
  }), [radius, color]);

  return (
    <Marker
      position={circleCenter}
      icon={circleIcon}
      draggable
      zIndexOffset={50}
      {...props}
    />
  );
});

Circle.propTypes = {
  latlng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
};

Circle.defaultProps = {
  selected: false,
  disabled: false,
};

export default Circle;
