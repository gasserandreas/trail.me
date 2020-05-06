import React from 'react';
import { text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import FilePanel from './FilePanel';
import { ActionPanel } from '../util';

import MapFileType from '../../../constants/MapFileType';

export default {
  title: 'Panels/FilePanel',
  component: FilePanel,
  decorators: [ActionPanel],
};

export const SimpleFilePanel = () => {
  const filetypeOptions = MapFileType;
  return (
    <FilePanel
      filename={text('filename', 'export')}
      filetype={select('filetype', filetypeOptions, 'gpx')}
      showUpload={boolean('showUpload', true)}
      showDownload={boolean('showDownload', true)}
      onFilenameChange={action('onFilenameChange')}
      onFiletypeChange={action('onFiletypeChange')}
      onClickReset={action('onClickReset')}
      onClickUpload={action('onClickUpload')}
      onClickDownload={action('onClickDownload')}
    />
  );
};
