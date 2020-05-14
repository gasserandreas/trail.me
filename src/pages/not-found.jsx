import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core';

import Page from '../ui/Layout/Page';
import { INDEX } from '../paths';

const useStyles = makeStyles((theme) => ({
  content: {
    flexFlow: 'column',
    padding: '5rem 25% 1rem',
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
  },
  pathname: {
    color: theme.palette.primary.main,
  },
  footer: {
    flexGrow: 0,
    flexShrink: 0,
  }
}));

const NotFound = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();

  const handleOnLinkClick = () => {
    history.push(INDEX);
  };

  return (
    <Page>
      <Box className={classes.content}>
        <Typography variant="h1" gutterBottom>
          No page for
          {' '}
          <span className={classes.pathname}>{pathname}</span>
        </Typography>
        <Typography>
          Sorry it seems you have found a death end.
          {' '}
          Please use this link to
          {' '}
          <Link
            onClick={handleOnLinkClick}
            to={INDEX}
          >
            go back
          </Link>
          {' '}
          to start page.
        </Typography>
      </Box>
    </Page>
  );
};

export default NotFound;
