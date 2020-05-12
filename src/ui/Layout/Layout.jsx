import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  layout: {
    flexGrow: 1,
    flexShrink: 1,
  },
}));

const Layout = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <main className={classes.layout} {...props}>
      {children}
    </main>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
