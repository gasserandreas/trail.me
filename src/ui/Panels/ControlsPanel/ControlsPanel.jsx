import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Panel, { SPACING, PanelContent } from '../Panel';

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
}));

const ControlsPanel = ({
  selectedCoordinates,
  onCoordinateDelete,
  onCoordinateReset,
  ...props
}) => {
  const classes = useStyles();

  const numberSelectedItems = useMemo(() => selectedCoordinates.length, [selectedCoordinates]);

  const deleteDisabled = numberSelectedItems === 0;

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

  const handleOnDeleteClick = (e) => {
    if (deleteDisabled) {
      return;
    }

    if (onCoordinateDelete) {
      onCoordinateDelete(e);
    }
  };

  const handleOnCancelClick = (e) => {
    if (onCoordinateReset) {
      onCoordinateReset(e);
    }
  };

  return (
    <Panel title="Coordinates" {...props}>
      <PanelContent>
        <div className={classes.controls}>
          {!deleteDisabled && (
            <>
              <Button
                onClick={handleOnCancelClick}
                className={classes.button}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOnDeleteClick}
                disabled={numberSelectedItems === 0}
                className={classes.button}
              >
                {deleteText}
              </Button>
            </>
          )}
        </div>
      </PanelContent>
    </Panel>
  );
};

ControlsPanel.propTypes = {
  selectedCoordinates: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCoordinateDelete: PropTypes.func,
  onCoordinateReset: PropTypes.func,
};

ControlsPanel.defaultProps = {
  onCoordinateDelete: () => {},
  onCoordinateReset: () => {},
};

export default ControlsPanel;
