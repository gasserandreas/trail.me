import React from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import SwissGeoMap, { FRICK_VIEWPORT } from '../SwissGeoMap';

export const SimpleExample = ({ initalViewport, ...props }) => {
  const [viewport, setViewport] = React.useState(initalViewport);

  const handleOnViewportChanged = (newViewport) => {
    const { onViewportChanged } = props;
    setViewport(newViewport);

    if (onViewportChanged) {
      onViewportChanged(newViewport);
    }
  };

  return (
    <SwissGeoMap
      {...props}
      onViewportChanged={handleOnViewportChanged}
      viewport={viewport}
      onClick={action('onClick')}
    />
  );
};

SimpleExample.propTypes = {
  initalViewport: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
  }),
  onViewportChanged: PropTypes.func,
};

SimpleExample.defaultProps = {
  initalViewport: FRICK_VIEWPORT,
  onViewportChanged: null,
};

export default SimpleExample;
