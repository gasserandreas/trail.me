import React, { FC } from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
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

type DeleteButtonProps = ButtonProps;
// HINT: use type DeleteButtonProps = ButtonProps & { your extra definition }; if needed

const DeleteButton: FC<DeleteButtonProps> = ({ className, ...props }) => {
  const classes = useStyles();
  const newClassName = className ? clsx(classes.button, className) : className;
  return <Button color="secondary" className={newClassName} {...props} />;
};

export default DeleteButton;
