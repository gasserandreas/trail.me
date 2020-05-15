import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { loadApplication } from './entities/application';

import { INDEX } from './paths';

import Layout from './ui/Layout/Layout';

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

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadApplication());
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Layout>
            <Router>
              <Switch>
                <Route exact path={INDEX} component={IndexPage} />
                <Route path="*" component={NotFound} />
              </Switch>
            </Router>
          </Layout>
        </div>
      </div>
    </Suspense>
  );
};

export default App;
