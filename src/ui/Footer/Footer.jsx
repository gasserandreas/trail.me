import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core';

import clsx from 'clsx';

import { version } from '../../../package.json';

const useStyles = makeStyles({
  footer: {
    fontSize: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const Footer = ({ className }) => {
  const classes = useStyles();

  return (
    <Typography variant="body2" className={clsx(classes.footer, className)}>
      <span>
        Created by:
        {' '}
        <Link href="https://gasserandreas.com" target="_blank">Andreas Gasser</Link>
      </span>
      {/* <br /> */}
      <span className={classes.version}>
        v.
        {' '}
        {version}
      </span>
    </Typography>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

Footer.defaultProps = {
  className: '',
};

export default Footer;
