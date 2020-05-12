import React from 'react';
import { useDispatch } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { loadApplication } from './entities/application';

import { INDEX, USER } from './paths';

import IndexPage from './pages/index/index';
import UserPage from './pages/user/index';
import NotFound from './pages/not-found';

import Layout from './ui/Layout/Layout';

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
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Layout>
          <Router>
            <Switch>
              <Route exact path={INDEX} component={IndexPage} />
              <Route path={USER} component={UserPage} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Router>
        </Layout>
      </div>
    </div>
  );
};

export default App;
