import React, { useMemo } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Panel, { SPACING, PanelContent } from '../Panel';
import DeleteButton from '../../DeleteButton/DeleteButton';
import { Undo, Redo } from '../../UndoRedoButton';

import {
  enableMultiSelect,
  setSelectedWaypoint,
  disableMultiSelect,
  removeWaypoints,
} from '../../../entities/route-edit';

import {
  multiSelectSelector,
  selectedWaypointIdsSelector,
  waypointsIdsForListSelector,
  splitEnabledSelector,
} from '../../../entities/route-edit/selector';

const useStyles = makeStyles(() => ({
  fileName: {
    width: '100%',
  },
  buttonMargin: {
    marginLeft: '0.5rem',
  },
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  select: {
    width: '100%',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.25rem',
  },
  button: {
    fontSize: '0.9rem',
  },
  buttonDelete: {
    color: '#000',
  }
}));

const ControlsPanel = ({ ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedWaypointIds = useSelector(selectedWaypointIdsSelector);
  const waypointsIds = useSelector(waypointsIdsForListSelector);
  const isMultiSelect = useSelector(multiSelectSelector);
  const splitEnabled = useSelector(splitEnabledSelector);

  const numberSelectedItems = useMemo(() => selectedWaypointIds.length, [selectedWaypointIds]);
  const deleteEnabled = numberSelectedItems > 0;

  const deleteText = React.useMemo(() => {
    switch (numberSelectedItems) {
      case 0:
        return 'Delete';
      case 1:
        return 'Delete item';
      default:
        return `Delete ${numberSelectedItems} items`;
    }
  }, [numberSelectedItems]);

  const handleOnDeleteClick = () => {
    if (!deleteEnabled) {
      return;
    }

    batch(() => {
      dispatch(removeWaypoints(selectedWaypointIds));
      dispatch(disableMultiSelect());
    });
  };

  const handleOnCancelClick = () => {
    batch(() => {
      dispatch(disableMultiSelect());
      dispatch(setSelectedWaypoint([]));
    });
  };

  const handleOnSelectClick = () => {
    dispatch(enableMultiSelect());
  };

  // don't render with no items
  if (waypointsIds.length === 0) {
    return null;
  }

  const title = (
    <span>
      Coordinats
      {
        splitEnabled && (<Typography variant="body2" display="inline"> [split mode enabled]</Typography>)
      }
    </span>
  );

  return (
    <Panel title={title} {...props}>
      <PanelContent>
        <div className={classes.controls}>
          <>
            {isMultiSelect ? (
              <Button
                onClick={handleOnCancelClick}
                className={classes.button}
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={handleOnSelectClick}
                className={classes.button}
              >
                Select
              </Button>
            )}
            <Box>
              <Undo />
              <Redo />
              {deleteEnabled && (
                <DeleteButton
                  onClick={handleOnDeleteClick}
                  disabled={numberSelectedItems === 0}
                  className={classes.button}
                >
                  {deleteText}
                </DeleteButton>
              )}
            </Box>
          </>
        </div>
      </PanelContent>
    </Panel>
  );
};

ControlsPanel.propTypes = {};

ControlsPanel.defaultProps = {};

export default ControlsPanel;
