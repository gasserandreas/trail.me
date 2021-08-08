import React from 'react';

import { object, number, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import OptionButtonComponent from './OptionButton';

export default {
  title: 'OptionButton',
  component: OptionButtonComponent,
};

const options = [
  {
    key: '1',
    value: 'Upload new',
  },
  {
    key: '2',
    value: 'Add to the beginning',
  },
  {
    key: '3',
    value: 'Add to end end',
  },
];

const sizes = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
};

const variant = {
  Contained: 'contained',
  Outlined: 'outlined',
  Text: '',
};

export const OptionButton = () => (
  <OptionButtonComponent
    size={select('size', sizes, sizes.Medium)}
    variant={select('variant', variant, variant.Contained)}
    options={object('options', options)}
    baseOptionIndex={number('number', 0)}
    onClick={action('onClick')}
  />
);
