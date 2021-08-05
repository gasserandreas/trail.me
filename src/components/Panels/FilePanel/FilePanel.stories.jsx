import React from 'react';

import FilePanel from '.';
import { ActionPanel } from '../util';

export default {
  title: 'Panels/FilePanel',
  component: FilePanel,
  decorators: [ActionPanel],
};

export const SimpleFilePanel = () => <FilePanel />;
