import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import Page from '../../ui/Layout/Page';
import Panel, { PanelContent } from '../../ui/Panels/Panel';
import Footer from '../../ui/Footer/Footer';

import ConnectedMap from './Map/ConnectedMap';
import ConnectedFilePanel from './ConnectedFilePanel';
import ConnectedMapPanel from './ConnectedMapPanel';
import ConnectedWaypointsPanel from './ConnectedWaypointsPanel';
import ConnectedControlsPanel from './ConnectedControlsPanel';

import HotKeys from '../../constants/HotKeys';

const useStyles = makeStyles(() => ({
  page: {
    display: 'flex',
    height: '100%',
  },
  map: {
    flexGrow: 1,
    flexShrink: 1,
  },
  actionPanel: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    width: '300px',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  filePanel: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: '1rem',
  },
  mapPanel: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: '1rem',
  },
  controlsPanel: {
    flexGrow: 0,
    flexShrink: 0,
    minHeight: '66px',
  },
  coordinatePanel: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: 'scroll',
  },
  title: {
    padding: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  footerPanel: {
    flexGrow: 0,
    flexShrink: 0,
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
  },
}));

const HomePage = () => {
  const classes = useStyles();

  /**
   * Get parent size and pass to virtualize list
   */
  const [waypointHeight, setWaypointHeight] = React.useState(null);
  const waypointRef = useCallback((node) => {
    if (node !== null) {
      setWaypointHeight(node.getBoundingClientRect().height);
    }
  }, []);

  /**
   * HotKeys handler
   */
  const deleteHandler = useCallback(() => {
    console.log('delete handler'); // eslint-disable-line no-console
  }, []);

  const handlers = {
    [HotKeys.DELETE]: deleteHandler,
  };

  return (
    <Page handlers={handlers}>
      <section className={classes.map}>
        <ConnectedMap />
      </section>
      <Box className={classes.actionPanel}>
        <Typography className={classes.title} variant="h1" component="h1">
          Trail.me
        </Typography>
        <div className={classes.filePanel}>
          <ConnectedFilePanel />
        </div>
        <div className={classes.mapPanel}>
          <ConnectedMapPanel />
        </div>
        <div className={classes.controlsPanel}>
          <ConnectedControlsPanel />
        </div>
        <div className={classes.coordinatePanel} ref={waypointRef}>
          <ConnectedWaypointsPanel panelHeight={waypointHeight} />
        </div>
        <div className={classes.footerPanel}>
          <Panel>
            <PanelContent>
              <Footer />
            </PanelContent>
          </Panel>
        </div>
      </Box>
    </Page>
  );
};

export default function () {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={HomePage} />
    </Switch>
  );
}
