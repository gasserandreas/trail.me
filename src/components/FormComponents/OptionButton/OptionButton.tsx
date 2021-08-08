import React, { FC, useState, useRef, useMemo } from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup, { ButtonGroupProps } from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles } from '@material-ui/core/styles';

type UseStylesProps = {
  size: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    baseButton: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    arrowButton: {
      paddingRight: '0px',
      paddingLeft: '0px',
      minWidth: theme.spacing(4),
    },
    menuItem: (props: UseStylesProps) => ({
      fontSize: props.size === 'small' ? '0.8rem' : '1rem',
    }),
  }),
);

export type OptionButtonOptions = {
  key: string;
  value: string;
};

// type OptionButtonProps = ButtonGroupProps & {
interface IOptionButtonProps extends ButtonGroupProps {
  options: Array<OptionButtonOptions>;
  baseOptionIndex: number;
  hideOptionKeys?: string[];
  disableButtonOnClick?: boolean;
  onOptionClick: (event: React.MouseEvent, option: OptionButtonOptions) => void;
}

const OptionButton: FC<IOptionButtonProps> = ({
  options,
  baseOptionIndex,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  onOptionClick = () => ({}),
  className = '',
  hideOptionKeys = [],
  disableButtonOnClick = false,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const classes = useStyles({ size });

  const filteredOptions = useMemo(
    () => options.filter(({ key }) => !hideOptionKeys.includes(key)),
    [options, hideOptionKeys],
  ); // eslint-disable-line max-len

  const handleMenuItemClick = (event: React.MouseEvent, index: number) => {
    setOpen(false);

    const option = filteredOptions[index];
    onOptionClick(event, option);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disableButtonOnClick) {
      return;
    }

    const option = filteredOptions[baseOptionIndex];
    onOptionClick(event, option);
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
        {...props}
      >
        <Button className={classes.baseButton} onClick={handleClick}>
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
                      dense
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

export default OptionButton;
