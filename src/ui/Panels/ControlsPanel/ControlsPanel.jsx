import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Panel, { SPACING, PanelContent } from '../Panel';
import DeleteButton from '../../DeleteButton/DeleteButton';

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

const ControlsPanel = ({
  isMultiSelect,
  selectedCoordinates,
  onCoordinateDelete,
  onCoordinateReset,
  onSetMultiSelect,
  ...props
}) => {
  const classes = useStyles();

  const numberSelectedItems = useMemo(() => selectedCoordinates.length, [selectedCoordinates]);
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

  const handleOnDeleteClick = (e) => {
    if (!deleteEnabled) {
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

  const handleOnSelectClick = (e) => {
    onSetMultiSelect(e);
  };

  return (
    <Panel title="Coordinates" {...props}>
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
            {deleteEnabled && (
              <DeleteButton
                onClick={handleOnDeleteClick}
                disabled={numberSelectedItems === 0}
                className={classes.button}
              >
                {deleteText}
              </DeleteButton>
            )}
          </>
        </div>
      </PanelContent>
    </Panel>
  );
};

ControlsPanel.propTypes = {
  isMultiSelect: PropTypes.bool,
  selectedCoordinates: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCoordinateDelete: PropTypes.func,
  onCoordinateReset: PropTypes.func,
  onSetMultiSelect: PropTypes.func,
};

ControlsPanel.defaultProps = {
  isMultiSelect: false,
  onCoordinateDelete: () => {},
  onCoordinateReset: () => {},
  onSetMultiSelect: () => {},
};

export default ControlsPanel;
