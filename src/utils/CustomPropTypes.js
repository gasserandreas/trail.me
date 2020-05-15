import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const CoordinatePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});
