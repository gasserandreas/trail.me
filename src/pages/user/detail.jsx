import React from 'react';
import { Link } from 'react-router-dom';

import { INDEX, USER } from '../../paths';

const DetailPage = () => (
  <div>
    <h1>User detail page</h1>
    <Link to={INDEX}>Go to home page</Link>
    <br />
    <Link to={USER}>Go to user page</Link>
  </div>
);

export default DetailPage;
