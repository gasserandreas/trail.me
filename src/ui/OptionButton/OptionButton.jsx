import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  baseButton: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  arrowButton: {
    paddingRight: '0px',
    paddingLeft: '0px',
    minWidth: theme.spacing(4),
  },
  menuItem: (props) => ({
    fontSize: props.size === 'small' ? '0.8rem' : '1rem',
  }),
}));

const OptionButton = ({
  options,
  baseOptionIndex,
  color,
  variant,
  size,
  onClick,
  className,
  hideOptionKeys,
  disableButtonOnClick,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles({ size });

  const filteredOptions = useMemo(() => options.filter(({ key }) => !hideOptionKeys.includes(key)), [options, hideOptionKeys]); // eslint-disable-line max-len

  const handleMenuItemClick = (event, index) => {
    setOpen(false);

    const option = filteredOptions[index];
    onClick(event, option);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const baseOptionValue = useMemo(() => {
    if (!baseOptionIndex || baseOptionIndex >= options.length) {
      return options[0].value;
    }

    const option = options[baseOptionIndex];
    return option.value || '';
  }, [options, baseOptionIndex]);

  const handleClick = (event) => {
    if (disableButtonOnClick) {
      return;
    }

    const option = filteredOptions[baseOptionIndex];
    onClick(event, option);
  };

  return (
    <>
      <ButtonGroup
        variant={variant}
        color={color}
        size={size}
        ref={anchorRef}
        className={className}
        aria-label="split button"
      >
        <Button
          className={classes.baseButton}
          onClick={handleClick}
        >
          {baseOptionValue}
        </Button>
        <Button
          color={color}
          size={size}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          className={classes.arrowButton}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {filteredOptions.map(({ key, value }, index) => (
                    <MenuItem
                      key={key}
                      onClick={(event) => handleMenuItemClick(event, index)}
                      className={classes.menuItem}
                      dense={variant === 'small'}
                    >
                      {value}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

OptionButton.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  baseOptionIndex: PropTypes.number.isRequired,
  hideOptionKeys: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  color: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  disableButtonOnClick: PropTypes.bool,
};

OptionButton.defaultProps = {
  onClick: () => ({}),
  color: 'primary',
  variant: 'contained',
  size: 'medium',
  className: '',
  hideOptionKeys: [],
  disableButtonOnClick: false,
};

export default OptionButton;
