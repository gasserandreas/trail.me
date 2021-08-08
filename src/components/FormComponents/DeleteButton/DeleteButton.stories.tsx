import React from 'react';

import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DeleteButtonComponent from './DeleteButton';

export default {
  title: 'FormComponents/DeleteButton',
  component: DeleteButtonComponent,
} as Meta;

export const DeleteButton = () => (
  <DeleteButtonComponent onClick={action('onClick')}>Delete</DeleteButtonComponent>
);
