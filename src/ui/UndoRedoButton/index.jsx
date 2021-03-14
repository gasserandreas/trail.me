import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';

import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

import { waypointsStatePastSelector, waypointsStateFutureSelector } from '../../entities/route-edit/selector';

const useStyles = makeStyles(() => ({
  button: {
    minWidth: 'auto',
    padding: '0.25rem 0.5rem',
    '& span': {
      marginLeft: '0',
    },
  },
}));

export const Undo = ({ ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const undoPast = useSelector(waypointsStatePastSelector);
  const canUndo = useMemo(() => undoPast.length > 0, [undoPast]);

  const handleOnClick = () => {
    if (!canUndo) return;

    dispatch(UndoActionCreators.undo());
  };

  return (
    <Button
      className={classes.button}
      variant="text"
      color="primary"
      size="small"
      endIcon={<UndoIcon />}
      onClick={handleOnClick}
      disabled={!canUndo}
      {...props}
    />
  );
};

Undo.propTypes = {};

export const Redo = ({ ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const undoPast = useSelector(waypointsStatePastSelector);
  const canUndo = useMemo(() => undoPast.length > 0, [undoPast]);

  const handleOnClick = () => {
    if (!canUndo) return;

    dispatch(UndoActionCreators.undo());
  };

  return (
    <Button
      className={classes.button}
      variant="text"
      color="primary"
      size="small"
      endIcon={<RedoIcon />}
      onClick={handleOnClick}
      disabled={!canUndo}
      {...props}
    />
  );
};

Redo.propTypes = {};

export default {
  Undo,
  Redo,
};
