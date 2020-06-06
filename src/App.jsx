import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { HotKeys as HotKeysComponent } from 'react-hotkeys';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { loadApplication } from './entities/application';

import { INDEX } from './paths';

import Layout from './ui/Layout/Layout';
import withTracker from './ui/Analytics/withTracker';
import HotKeys from './constants/HotKeys';

const IndexPage = React.lazy(() => import('./pages/index/index'));
const NotFound = React.lazy(() => import('./pages/not-found'));

const useStyles = makeStyles(() => ({
  root: {
    dispaly: 'flex',
  },
  wrapper: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
  },
}));

/**
 * Define HotKeys KeyMap
 */
const keyMap = {
  [HotKeys.DELETE]: ['del', 'backspace'],
};

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadApplication());
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotKeysComponent keyMap={keyMap}>
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <Layout>
              <Router>
                <Switch>
                  <Route exact path={INDEX} component={withTracker(IndexPage)} />
                  <Route path="*" component={withTracker(NotFound)} />
                </Switch>
              </Router>
            </Layout>
          </div>
        </div>
      </HotKeysComponent>
    </Suspense>
  );
};

export default App;
