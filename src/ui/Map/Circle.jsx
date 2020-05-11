import React from 'react';
// import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// import Leaflet from 'leaflet';
// import { Marker } from 'react-leaflet';
import { Circle as LCircle } from 'react-leaflet';

import { useTheme } from '@material-ui/core/styles';

// const Circle = ({
//   latlng, zoom, selected, ...props
// }) => {
//   const theme = useTheme();
//   const { palette: { primary } } = theme;

//   const circleCenter = [latlng.lat, latlng.lng];
//   const radius = (102 - 5 * zoom);
//   const color = selected ? primary.dark : primary.main;

//   const circleIcon = useMemo(() => Leaflet.divIcon({
//     iconSize: [radius, radius],
//     iconAnchor: [radius / 2, radius / 2],
//     className: '',
// eslint-disable-next-line max-len
//     html: `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>
//           <circle cx='50' cy='50' r='40' fill='${color}' stroke='rgba(0,0,0,0.7)' stroke-width='5'></circle>
//         </svg>`
//   }), [radius, color]);

//   return (
//     <Marker
//       position={circleCenter}
//       icon={circleIcon}
//       draggable
//       zIndexOffset={50}
//       {...props}
//     />
//   );
// };

const Circle = ({
  latlng, zoom, selected, ...props
}) => {
  const theme = useTheme();
  const { palette: { primary } } = theme;

  const circleCenter = [latlng.lat, latlng.lng];
  const radius = (102 - 5 * zoom);
  const color = selected ? primary.dark : primary.light;
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
