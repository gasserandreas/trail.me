import React from 'react';

import Panel, { PanelContent } from './Panel';
import { ActionPanel } from './util';

export default {
  title: 'Panels',
  component: Panel,
  decorators: [ActionPanel],
};

export const SimplePanel = () => (
  <Panel title="Your title">
    <PanelContent>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      {' '}
      labore et dolore magna aliqua. Venenatis tellus in metus vulputate eu scelerisque felis.
      {' '}
      Orci eu lobortis elementum nibh tellus molestie. Fermentum dui faucibus in ornare.
      {' '}
      Lorem sed risus ultricies tristique. Risus nec feugiat in fermentum.
      {' '}
      Nulla malesuada pellentesque elit eget gravida cum sociis. Tincidunt arcu non
      {' '}
      sodales neque sodales ut etiam sit amet. Egestas purus viverra accumsan in.
      {' '}
      Auctor eu augue ut lectus arcu bibendum at varius. Varius sit amet mattis vulputate enim
      {' '}
      nulla aliquet porttitor. Felis eget velit aliquet sagittis id consectetur.
      {' '}
      Purus semper eget duis at tellus at urna condimentum.
    </PanelContent>
  </Panel>
);
