import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList } from 'react-window';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { SPACING } from '../Panel';
import { getInBetweenElements } from './util';
import { shortenCoordinate } from '../../../utils/coordinate';

const ROW_HEIGHT = 56;

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
  waypointSelectedById,
  onWaypointSelect,
  onWaypointDeSelect,
  parentHeight,
  pending,
}) => {
  const classes = useStyles();

  const [lastClicked, setLastClicked] = useState(null);

  const handleOnClick = (selectedId) => (e) => {
    const { shiftKey } = e;

    if (lastClicked && shiftKey) {
      const inBetweenIds = getInBetweenElements(waypointIds, lastClicked, selectedId);
      onWaypointSelect(e, inBetweenIds);

      setLastClicked(selectedId);
      return;
    }

    // simple click
    setLastClicked(selectedId);
    if (waypointSelectedById[selectedId].value) {
      onWaypointDeSelect(e, [selectedId]);
    } else {
      onWaypointSelect(e, [selectedId]);
    }
  };

  const renderRow = (args) => {
    const { index, style } = args;

    const id = waypointIds[index];
    const { lat, lng } = waypointById[id];

    return (
      <span key={`coordinate-item-${id}`}>
        <ListItem
          style={style}
          onClick={handleOnClick(id)}
          selected={waypointSelectedById[id].value}
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
          <ListItemIcon>
            <Checkbox
              checked={waypointSelectedById[id].value}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': id }}
            />
          </ListItemIcon>
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

  return (
    <List>
      <Divider />
      <VariableSizeList height={parentHeight} itemSize={() => ROW_HEIGHT} itemCount={waypointIds.length}>
        {renderRow}
      </VariableSizeList>
      <Divider />
    </List>
  );
};

WaypointsPanel.propTypes = {
  waypointById: PropTypes.shape({}).isRequired,
  waypointIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  waypointSelectedById: PropTypes.shape({}).isRequired,
  onWaypointSelect: PropTypes.func,
  onWaypointDeSelect: PropTypes.func,
  parentHeight: PropTypes.number,
  pending: PropTypes.bool,
};

WaypointsPanel.defaultProps = {
  onWaypointSelect: () => {},
  onWaypointDeSelect: () => {},
  parentHeight: null,
  pending: false,
};

export default WaypointsPanel;