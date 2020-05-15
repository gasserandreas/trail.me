import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Footer from '../Footer/Footer';

const useStyles = makeStyles((theme) => ({
  layout: {
    flexGrow: 1,
    flexShrink: 1,
  },
  notSupported: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },

    height: '100vh',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '4rem 2rem 1rem',
  },
}));

const Layout = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <main className={classes.layout} {...props}>
      <Box className={classes.notSupported} justifyContent="space-between">
        <Box>
          <Typography variant="h1" gutterBottom>Not supported</Typography>
          <Typography>
            I am sorry, your device is not supported.
            <br />
            Please use another device and try again.
          </Typography>
        </Box>
        <Footer />
      </Box>
      {children}
    </main>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
