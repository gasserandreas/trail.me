import React, { MouseEventHandler, FC } from 'react';
import { useSelector } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { waypointsByIdSelector, metaStateSelector } from '../../../entities/route-edit/selectors';

import { shortenCoordinate } from '../../../utils/coordinate';

const useStyles = makeStyles(() => ({
  listItemText: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
}));

export type WaypointListItemType = {
  id: string;
  style: React.CSSProperties | undefined;
  last?: boolean;
  splitMode?: boolean;
  selectable?: boolean;
  handleOnClick: (id: string, event: React.MouseEvent<HTMLDivElement>) => void;
  handleOnIconClick: (id: string, event: React.MouseEvent<HTMLSpanElement>) => void;
};

const WaypointListItem: FC<WaypointListItemType> = ({
  id,
  style,
  last = false,
  splitMode = false,
  selectable = false,
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
        onClick={(event: React.MouseEvent<HTMLDivElement>) => handleOnClick(id, event)}
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
          primary={
            <>
              <Typography display="inline" variant="body2">
                Lat:{' '}
              </Typography>
              <Typography display="inline" variant="body1">
                {shortenCoordinate(String(lat))}
              </Typography>
            </>
          }
          className={classes.listItemText}
        />
        <ListItemText
          primary={
            <>
              <Typography display="inline" variant="body2">
                Long:{' '}
              </Typography>
              <Typography display="inline" variant="body1">
                {shortenCoordinate(String(lng))}
              </Typography>
            </>
          }
          className={classes.listItemText}
        />
        {!selectable && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <span
            onClick={(event: React.MouseEvent<HTMLSpanElement>) => handleOnIconClick(id, event)}
          >
            <MoreVertIcon />
          </span>
        )}
      </ListItem>
      {last && <Divider key={`coordinate-item-divider-${id}`} />}
    </span>
  );
};

export default WaypointListItem;
