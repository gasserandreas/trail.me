import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import Panel, { PanelContent, SPACING, PanelContentProps } from '../Panel';

import { cancelSplit, saveSplit } from '../../../entities/route-edit';

const useStyles = makeStyles(() => ({
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  controls: {
    display: 'flex',
    padding: '0.5rem 0',
    justifyContent: 'space-between',
  },
  buttons: {
    flexShrink: 0,
    flexGrow: 0,
  },
}));

const SplitPanel: FC<PanelContentProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleOnSave = () => {
    dispatch(saveSplit());
  };

  const handleOnCancel = () => {
    dispatch(cancelSplit());
  };

  const disabledSave = false;

  return (
    <Panel {...props}>
      <PanelContent>
        <div className={classes.controls}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            endIcon={<CloseIcon />}
            className={classes.buttons}
            onClick={handleOnCancel}
          >
            Cancel split
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<CheckIcon />}
            className={classes.buttons}
            onClick={handleOnSave}
            disabled={disabledSave}
          >
            Save split
          </Button>
        </div>
      </PanelContent>
    </Panel>
  );
};

export default SplitPanel;
