import React from 'react';
import {
  Route, Link, Switch, useRouteMatch
} from 'react-router-dom';

import DetailPage from './detail';

import { INDEX, DETAIL } from '../../paths';

/**
 * User page component
 */
const UserPage = () => {
  const { url } = useRouteMatch();

  return (
    <div>
      <h1>User Page</h1>
      <Link to={INDEX}>Go to home page</Link>
      <br />
      <Link to={`${url}/${DETAIL}`}>Go to user detail page</Link>
    </div>
  );
};

/**
 * Define sub-routing for user
 */
export default function () {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={UserPage} />
      <Route path={`${path}/${DETAIL}`} component={DetailPage} />
    </Switch>
  );
}
