import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { makeStyles } from '@material-ui/core/styles';

import Panel, { PanelContent } from '../../ui/Panels/Panel';
// import SwissGeoMap, { FRICK_VIEWPORT } from '../../ui/Map/SwissGeoMap';
import ConnectedMap from './ConnectedMap';

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
  coordinatePanel: {
    flexGrow: 1,
    flexShrink: 1,
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

  // const [viewport, setViewport] = useState(FRICK_VIEWPORT);

  // const [center, setCenter] = useState(FRICK_VIEWPORT.center);
  // const [zoom, setZoom] = useState(FRICK_VIEWPORT.zoom);

  // const viewport = {
  //   center,
  //   zoom,
  // };

  // const handleOnViewportChange = (newViewport) => {
  //   // setViewport(newViewport);
  // };

  return (
    <div className={classes.page}>
      <section className={classes.map}>
        {/* <SwissGeoMap
          // {...props}
          onViewportChanged={handleOnViewportChange}
          viewport={viewport}
          // onClick={handleMapClick}
        /> */}
        <ConnectedMap />
      </section>
      <Box className={classes.actionPanel}>
        <Typography className={classes.title} variant="h1" component="h1">
          Trail.me
        </Typography>
        <div className={classes.filePanel}>
          <Panel>
            <PanelContent>
              <Typography>File Panel</Typography>
            </PanelContent>
          </Panel>
        </div>
        <div className={classes.mapPanel}>
          <Panel>
            <PanelContent>
              <Typography>Map Panel</Typography>
            </PanelContent>
          </Panel>
        </div>
        <div className={classes.coordinatePanel}>
          <Panel>
            <PanelContent>
              <Typography>Coordinates Panel</Typography>
            </PanelContent>
          </Panel>
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
