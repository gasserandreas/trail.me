import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, batch } from 'react-redux';

import { VariableSizeList } from 'react-window';

import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import WaypointListItem from './WaypointListItem';
import EmptyPanel from './EmptyPanel';

import {
  removeWaypoint,
  enableMultiSelect,
  selectWaypoints,
  deSelectWaypoints,
  setSelectedWaypoint,
  startSplit,
  setActionType,
} from '../../../entities/route-edit';
import {
  multiSelectSelector, metaStateSelector, waypointsIdsForListSelector, waypointsByIdSelector
} from '../../../entities/route-edit/selectors';

import { setViewportCoordinates } from '../../../entities/map';

import { SPACING } from '../Panel';
import { getInBetweenElements } from './util';

import MapActions from '../../../constants/MapActions';

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
  const waypointIds = useSelector(waypointsIdsForListSelector);
  const waypointsById = useSelector(waypointsByIdSelector);
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

  const handleOnMenuClose = useCallback(() => {
    setListAncherRef(null);
  }, [setListAncherRef]);

  const handleSplitWaypoint = useCallback(() => {
    batch(() => {
      dispatch(startSplit(openedMenuId));
      dispatch(setActionType(MapActions.ADD));
    });
  }, [dispatch, openedMenuId]);

  const handleDeleteWaypoint = useCallback(() => {
    dispatch(removeWaypoint(openedMenuId));
  }, [dispatch, openedMenuId]);

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
      const { lat, lng } = waypointsById[id];
      batch(() => {
        dispatch(setSelectedWaypoint([id]));
        dispatch(setViewportCoordinates([lat, lng]));
      });

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

  const menuItem = useMemo(() => {
    /**
     * menu item render
     */

    const MENU_ITEMS = [
      {
        label: 'Split',
        callback: handleSplitWaypoint,
        meta: {
          disabled: openedMenuId === waypointIds[waypointIds.length - 1],
        }
      },
      {
        label: 'Delete',
        callback: handleDeleteWaypoint,
      },
    ];

    return MENU_ITEMS.map(({ label, callback, meta }) => (
      <MenuItem
        onClick={(event) => {
          handleOnMenuClose();
          callback(event);
        }}
        key={`menu-item-${label}`}
        disabled={meta && meta.disabled}
      >
        {label}
      </MenuItem>
    ));
  }, [waypointIds, openedMenuId, handleDeleteWaypoint, handleSplitWaypoint, handleOnMenuClose]);

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

  const itemCount = waypointIds.length;

  return (
    <>
      { itemCount > 0 ? (
        <List className={classes.list}>
          { itemCount > 0 && <Divider />}
          <Divider />
          <VariableSizeList
            ref={listRef}
            height={correctedParentHeight}
            itemSize={() => ROW_HEIGHT}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
          <Divider />
        </List>
      ) : <EmptyPanel />}
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
