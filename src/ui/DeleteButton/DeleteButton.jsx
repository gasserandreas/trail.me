import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.text.primary,

    '&:hover': {
      color: theme.palette.secondary.light,
    },
  },
}));

const DeleteButton = ({ className, ...props }) => {
  const classes = useStyles();

  const newClassName = clsx(classes.button, className);

  return (
    <Button
      color="secondary"
      className={newClassName}
      {...props}
    />
  );
};

DeleteButton.propTypes = {
  className: PropTypes.string,
};

DeleteButton.defaultProps = {
  className: null,
};

export default DeleteButton;
