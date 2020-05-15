import React from 'react';
import { action } from '@storybook/addon-actions';

import SimpleExample from './examples/SimpleExample';
import DrawLineExample from './examples/DrawLineExample';
import CircleExample from './examples/CircleExample';
import PolygonExample from './examples/PolygonExample';

const FullSize = (story) => {
  const styles = {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    display: 'block',
  };

  return (
    <div style={styles}>
      {story()}
    </div>
  );
};

export default {
  title: 'Leaflet',
  component: Map,
  decorators: [FullSize],
};

export const LeafletMap = () => (
  <SimpleExample onViewportChanged={action('onViewportChanged')} />
);

export const DrawLine = () => <DrawLineExample />;

export const Circles = () => <CircleExample />;

export const Polygon = () => <PolygonExample />;
