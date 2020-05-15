import React from 'react';
import { action } from '@storybook/addon-actions';

import DeleteButtonComponent from './DeleteButton';

export default {
  title: 'DeleteButton',
  component: DeleteButtonComponent,
};

export const Footer = () => (
  <DeleteButtonComponent
    onClick={action('onClick')}
  />
);
