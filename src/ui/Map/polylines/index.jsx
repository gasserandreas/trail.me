import React from 'react';
import PropTypes from 'prop-types';
import { Polyline as LPolyline } from 'react-leaflet';

import { useTheme } from '@material-ui/core/styles';

const Polyline = React.memo(({
  startLatlng, endLatlng, selected, disabled, ...props
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

  const weight = 8;
  const color = getColor(selected, disabled);
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
});

Polyline.propTypes = {
  startLatlng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  endLatlng: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Polyline.defaultProps = {
  selected: false,
  disabled: false,
  onClick: null,
};

export default Polyline;
