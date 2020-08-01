import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { VariableSizeList } from 'react-window';

import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import WaypointListItem from './WaypointListItem';

import {
  removeWaypoint,
  enableMultiSelect,
  selectWaypoints,
  deSelectWaypoints,
  setSelectedWaypoint,
} from '../../../entities/route-edit';
import { waypointsIdsSelector, multiSelectSelector, metaStateSelector } from '../../../entities/route-edit/selector';

import { SPACING } from '../Panel';
import { getInBetweenElements } from './util';

const ROW_HEIGHT = 56;
const HEIGH_ADJUSTMENT = 2; // 2 * 1 px Dividerg

const useStyles = makeStyles(() => ({
  list: {
    paddingBottom: 0,
    paddingTop: 0,
    flexGrow: 1,
    flexShrink: 1,
  },
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
}));

const WaypointPanel = ({
  parentHeight,
}) => {
  const classes = useStyles();

  const listRef = useRef();
  const anchorEl = useRef();

  const [listAncherPosition, setListAncherPosition] = useState({ top: 0, left: 0, right: 0 });
  const [listAncherRef, setListAncherRef] = useState(null);
  const [openedMenuId, setOpenedMenuId] = useState(null);

  const [lastClicked, setLastClicked] = useState(null);

  const correctedParentHeight = parentHeight - HEIGH_ADJUSTMENT;

  const dispatch = useDispatch();
  const waypointIds = useSelector(waypointsIdsSelector);
  const isMultiSelect = useSelector(multiSelectSelector);
  const waypointMeta = useSelector(metaStateSelector);

  useMemo(() => {
    if (!isMultiSelect) {
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
  }, [waypointIds, waypointMeta, isMultiSelect]);

  // event handler for menu item
  const handleOnIconClick = (id) => (event) => {
    event.stopPropagation();

    setOpenedMenuId(id);

    setListAncherPosition(event.currentTarget.getBoundingClientRect());
    setListAncherRef(anchorEl.current);
  };

  const handleOnMenuClose = () => {
    setListAncherRef(null);
  };

  // eslint-disable-next-line
  const handleSplitWaypoint = (event) => {
    // eslint-disable-next-line
    console.log('handleSplitWaypoint');
    // onWaypointSplitStart(event, openedMenuId);
  };

  const handleDeleteWaypoint = () => {
    dispatch(removeWaypoint(openedMenuId));
  };

  const handleOnClick = (id) => (e) => {
    const { shiftKey } = e;

    /**
     * handle shift multi selection
     */
    if (lastClicked && shiftKey) {
      const inBetweenIds = getInBetweenElements(waypointIds, lastClicked, id);
      dispatch(selectWaypoints(inBetweenIds));
      dispatch(enableMultiSelect());

      setLastClicked(id);
      return;
    }

    /**
     * simple select allowed only
     */
    if (!isMultiSelect) {
      dispatch(setSelectedWaypoint([id]));
      setLastClicked(id);
      return;
    }

    /**
     * handle default multi select behavior
     */
    setLastClicked(id);
    if (waypointMeta[id].selected) {
      dispatch(deSelectWaypoints([id]));
    } else {
      dispatch(selectWaypoints([id]));
    }
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

    return (
      <WaypointListItem
        id={id}
        style={style}
        last={index !== (waypointIds.length - 1)}
        selectable={isMultiSelect}
        handleOnClick={handleOnClick}
        handleOnIconClick={handleOnIconClick}
      />
    );
  };

  if (!parentHeight) {
    return null;
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

WaypointPanel.propTypes = {
  parentHeight: PropTypes.number,
};

WaypointPanel.defaultProps = {
  parentHeight: 0,
};

export default WaypointPanel;
