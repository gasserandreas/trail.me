import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  page: {
    display: 'flex',
    height: '100%',
  },
}));

const Page = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.page} {...props}>
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
