import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  page: {
    display: 'flex',
    height: '100%',
  },
}));

const Page = ({ children, className, ...props }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.page, className)} {...props}>
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Page.defaultProps = {
  className: '',
};

export default Page;
