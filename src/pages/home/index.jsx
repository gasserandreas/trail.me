import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import Page from '../../ui/Layout/Page';
import Footer from '../../ui/Footer/Footer';

import Panel, { PanelContent } from '../../ui/Panels/Panel';
import WaypointsPanel from '../../ui/Panels/WaypointsPanel';
import FilePanel from '../../ui/Panels/FilePanel';
import ControlsPanel from '../../ui/Panels/ControlsPanel';
import MapPanel from '../../ui/Panels/MapPanel';
import SplitPanel from '../../ui/Panels/SplitPanel';
import ConnectedMap from '../../ui/Map/ConnectedMap';

import ConnectedStatistics from './ConnectedStatistics';

import HotKeys from '../../constants/HotKeys';

import { removeWaypoints } from '../../entities/route-edit';
import { metaStateSelector, splitEnabledSelector } from '../../entities/route-edit/selectors';

// import { statisticsShouldBeShown } from '../../entities/statistics/selector';

const useStyles = makeStyles((theme) => ({
  page: {
    display: 'flex',
    height: '100%',
  },
  map: {
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
  },
  statistics: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: 1000,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  },
  actionPanel: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    width: theme.spacing(40),
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
  splitPanel: {
    flexGrow: 0,
    flexShrink: 0,
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
  const dispatch = useDispatch();

  // const showStatistics = useSelector(statisticsShouldBeShown);
  const showStatistics = false;
  const meta = useSelector(metaStateSelector);
  const splitEnabled = useSelector(splitEnabledSelector);

  const selectedWaypoinIds = Object.entries(meta)
    .map((key, value) => {
      if (value.selected) {
        return key;
      }

      return undefined;
    })
    .filter(Boolean);

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
  const handlers = {
    [HotKeys.DELETE]: () => dispatch(removeWaypoints(selectedWaypoinIds)),
  };

  return (
    <Page handlers={handlers}>
      <section className={classes.map}>
        <ConnectedMap />
        {showStatistics && (
          <div className={classes.statistics}>
            <ConnectedStatistics />
          </div>
        )}
      </section>
      <Box className={classes.actionPanel}>
        <Typography className={classes.title} variant="h1" component="h1">
          Trail.me
        </Typography>
        <div className={classes.filePanel}>
          <FilePanel />
        </div>
        <div className={classes.mapPanel}>
          <MapPanel />
        </div>
        <div className={classes.controlsPanel}>
          <ControlsPanel />
        </div>
        <div className={classes.coordinatePanel} ref={waypointRef}>
          <WaypointsPanel parentHeight={waypointHeight} />
        </div>
        {splitEnabled && (
          <div className={classes.splitPanel}>
            <SplitPanel />
          </div>
        )}
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

export default function Home() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={HomePage} />
    </Switch>
  );
}
