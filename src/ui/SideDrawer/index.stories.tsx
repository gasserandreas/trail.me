import React from 'react';

import SideDrawer from './index';

export default {
  title: 'SideDrawer',
  component: SideDrawer,
};

export const SideDrawerStory = () => <SideDrawer>Hello</SideDrawer>;

SideDrawerStory.story = {
  name: 'SideDrawer',
};
