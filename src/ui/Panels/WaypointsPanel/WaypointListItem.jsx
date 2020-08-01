import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { waypointsByIdSelector, metaStateSelector } from '../../../entities/route-edit/selector';

import { shortenCoordinate } from '../../../utils/coordinate';

const useStyles = makeStyles(() => ({
  listItemText: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
}));

const WaypointListItem = ({
  id,
  style,
  last,
  splitMode,
  selectable,
  handleOnClick,
  handleOnIconClick,
}) => {
  const classes = useStyles();

  const waypointsById = useSelector(waypointsByIdSelector);
  const waypointMeta = useSelector(metaStateSelector);

  const waypoint = waypointsById[id];
  const meta = waypointMeta[id];

  if (!waypoint) {
    return null;
  }

  const { lat, lng } = waypoint;
  const { disabled, selected } = meta;

  return (
    <span key={`coordinate-item-${id}`}>
      <ListItem
        style={style}
        selected={selected}
        disabled={disabled}
        onClick={handleOnClick(id)}
        dense
        button
      >
        {selectable && (
          <ListItemIcon>
            <Checkbox
              checked={meta.selected}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': id }}
            />
          </ListItemIcon>
        )}
        <ListItemText
          inset={splitMode && !disabled}
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
        {!selectable && (
          <MoreVertIcon onClick={handleOnIconClick(id)} />
        )}
      </ListItem>
      {last && (
        <Divider key={`coordinate-item-divider-${id}`} />
      )}
    </span>
  );
};

export default WaypointListItem;

WaypointListItem.propTypes = {
  style: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  splitMode: PropTypes.bool,
  last: PropTypes.bool,
  selectable: PropTypes.bool,
  handleOnClick: PropTypes.func.isRequired,
  handleOnIconClick: PropTypes.func.isRequired,
};

WaypointListItem.defaultProps = {
  splitMode: false,
  last: false,
  selectable: false,
};
