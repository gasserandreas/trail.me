import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList } from 'react-window';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { SPACING } from '../Panel';
import { getInBetweenElements } from './util';
import { shortenCoordinate } from '../../../utils/coordinate';

const ROW_HEIGHT = 56;
const HEIGH_ADJUSTMENT = 2; // 2 * 1 px Dividerg

const useStyles = makeStyles((theme) => ({
  list: {
    paddingBottom: 0,
    paddingTop: 0,
    flexGrow: 1,
    flexShrink: 1,
  },
  listItemText: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  pending: {
    marginTop: theme.spacing(8),
    textAlign: 'center',
  },
}));

const WaypointsPanel = ({
  waypointById,
  waypointIds,
  waypointMeta,
  onWaypointSelect,
  onWaypointDeSelect,
  onWaypointSetSelected,
  onSetMultiSelect,
  onWaypointDelete,
  onWaypointSplit,
  parentHeight,
  pending,
  multiSelect,
}) => {
  const classes = useStyles();

  const listRef = useRef();
  const anchorEl = useRef();

  const [listAncherPosition, setListAncherPosition] = useState({ top: 0, left: 0, right: 0 });
  const [listAncherRef, setListAncherRef] = useState(null);
  const [openedMenuId, setOpenedMenuId] = useState(null);

  const [lastClicked, setLastClicked] = useState(null);

  const correctedParentHeight = parentHeight - HEIGH_ADJUSTMENT;

  useMemo(() => {
    if (!multiSelect) {
      // get selected waypoint id
      const selectedWaypoint = Object.entries(waypointMeta)
        .find((arr) => {
          const { selected } = arr[1];
          return selected === true;
        });

      if (selectedWaypoint) {
        // jump to point in list
        const key = selectedWaypoint[0];
        const index = waypointIds.indexOf(key);
        listRef.current.scrollToItem(index);
      }
    }
  }, [waypointIds, waypointMeta, multiSelect]);

  const handleOnClick = (selectedId) => (e) => {
    const { shiftKey } = e;

    /**
     * handle shift multi selection
     */
    if (lastClicked && shiftKey) {
      const inBetweenIds = getInBetweenElements(waypointIds, lastClicked, selectedId);
      onWaypointSelect(e, inBetweenIds);
      onSetMultiSelect(e, true);

      setLastClicked(selectedId);
      return;
    }

    /**
     * simple select allowed only
     */
    if (!multiSelect) {
      onWaypointSetSelected(e, selectedId);
      setLastClicked(selectedId);
      return;
    }

    /**
     * handle default multi select behaviour
     */
    setLastClicked(selectedId);
    if (waypointMeta[selectedId].selected) {
      onWaypointDeSelect(e, [selectedId]);
    } else {
      onWaypointSelect(e, [selectedId]);
    }
  };

  // event handler for menu item
  const handleOnIconClick = (event, id) => {
    event.stopPropagation();

    setOpenedMenuId(id);

    setListAncherPosition(event.currentTarget.getBoundingClientRect());
    setListAncherRef(anchorEl.current);
  };

  const handleOnMenuClose = () => {
    setListAncherRef(null);
  };

  const handleSplitWaypoint = (event) => {
    onWaypointSplit(event, openedMenuId);
  };

  const handleDeleteWaypoint = (event) => {
    onWaypointDelete(event, openedMenuId);
  };

  /**
   * menu item render
   */

  const MENU_ITEMS = [
    {
      label: 'Split',
      callback: handleSplitWaypoint,
    },
    {
      label: 'Delete',
      callback: handleDeleteWaypoint,
    },
  ];

  const menuItem = useMemo(() => MENU_ITEMS.map(({ label, callback }) => (
    <MenuItem
      onClick={(event) => {
        handleOnMenuClose();
        callback(event);
      }}
      key={`menu-item-${label}`}
    >
      {label}
    </MenuItem>
  )), [MENU_ITEMS]);

  const renderRow = (args) => {
    const { index, style } = args;

    const id = waypointIds[index];
    const { lat, lng } = waypointById[id];
    const meta = waypointMeta[id];

    return (
      <span key={`coordinate-item-${id}`}>
        <ListItem
          style={style}
          onClick={handleOnClick(id)}
          selected={meta.selected}
          button
          dense
        >
          <ListItemText
            primary={(
              <>
                <Typography display="inline" variant="body2">Lat: </Typography>
                <Typography display="inline" variant="body1">{shortenCoordinate(String(lat))}</Typography>
              </>
            )}
            className={classes.listItemText}
          />
          <ListItemText
            primary={(
              <>
                <Typography display="inline" variant="body2">Long: </Typography>
                <Typography display="inline" variant="body1">{shortenCoordinate(String(lng))}</Typography>
              </>
            )}
            className={classes.listItemText}
          />
          {multiSelect && (
            <ListItemIcon>
              <Checkbox
                checked={meta.selected}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': id }}
              />
            </ListItemIcon>
          )}
          {!multiSelect && (
            <MoreVertIcon onClick={(event) => handleOnIconClick(event, id)} />
          )}
        </ListItem>
        {index !== (waypointIds.length - 1) && (
          <Divider key={`coordinate-item-divider-${id}`} />
        )}
      </span>
    );
  };

  if (!parentHeight) {
    return null;
  }

  if (pending) {
    return (
      <Box justifyContent="center" alignItems="center" className={classes.pending}>
        <CircularProgress size={100} />
      </Box>
    );
  }

  const anchorElStyles = {
    position: 'fixed',
    top: listAncherPosition.top,
    left: listAncherPosition.left,
    right: listAncherPosition.right,
    backgroundColor: 'red',
  };

  return (
    <>
      <List className={classes.list}>
        <Divider />
        <VariableSizeList
          ref={listRef}
          height={correctedParentHeight}
          itemSize={() => ROW_HEIGHT}
          itemCount={waypointIds.length}
        >
          {renderRow}
        </VariableSizeList>
        <Divider />
      </List>
      <div style={anchorElStyles} ref={anchorEl} />
      <Menu
        id="waypoint-list-item-menu"
        anchorEl={listAncherRef}
        keepMounted
        open={Boolean(listAncherRef)}
        onClose={handleOnMenuClose}
      >
        {menuItem}
      </Menu>
    </>
  );
};

WaypointsPanel.propTypes = {
  waypointById: PropTypes.shape({}).isRequired,
  waypointIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  waypointMeta: PropTypes.shape({}).isRequired,
  onWaypointSelect: PropTypes.func,
  onWaypointDeSelect: PropTypes.func,
  onWaypointSetSelected: PropTypes.func,
  onSetMultiSelect: PropTypes.func,
  onWaypointDelete: PropTypes.func,
  onWaypointSplit: PropTypes.func,
  parentHeight: PropTypes.number,
  pending: PropTypes.bool,
  multiSelect: PropTypes.bool,
};

WaypointsPanel.defaultProps = {
  onWaypointSelect: () => {},
  onWaypointDeSelect: () => {},
  onWaypointSetSelected: () => {},
  onSetMultiSelect: () => {},
  onWaypointDelete: () => {},
  onWaypointSplit: () => {},
  parentHeight: null,
  pending: false,
  multiSelect: false,
};

export default WaypointsPanel;
