import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { makeStyles } from '@material-ui/core/styles';

import Panel, { PanelContent } from '../../ui/Panels/Panel';
import ConnectedMap from './Map/ConnectedMap';
import ConnectedFilePanel from './ConnectedFilePanel';
import ConnectedMapPanel from './ConnectedMapPanel';
import ConnectedCoordinatesPanel from './ConnectedCoordinatesPanel';
import ConnectedControlsPanel from './ConnectedControlsPanel';

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

  return (
    <div className={classes.page}>
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
        <div className={classes.coordinatePanel}>
          <ConnectedCoordinatesPanel />
        </div>
        <div className={classes.footerPanel}>
          <Panel>
            <PanelContent>
              <Typography variant="body2">
                Created by:
                {' '}
                <Link href="https://gasserandreas.com" target="_blank">Andreas Gasser</Link>
              </Typography>
            </PanelContent>
          </Panel>
        </div>
      </Box>
    </div>
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
