import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { SPACING } from '../Panel';
import { getInBetweenElements } from './util';

import { shortenCoordinate } from '../../../utils/coordinate';
import { CoordinatePropType } from '../../../utils/CustomPropTypes';

const useStyles = makeStyles(() => ({
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
}));


const CoordinatesPanel = ({
  coordinates,
  selectedCoordinates,
  onCoordinateSelect,
  onCoordinateDeSelect,
  ...props
}) => {
  const classes = useStyles();
  const [lastClicked, setLastClicked] = useState(null);

  // pre-calculate selected coordinates map
  const selectedCoordinatesMap = useMemo(() => coordinates.reduce((prev, cur) => {
    const { id } = cur;
    const isSelected = selectedCoordinates.includes(id);

    return {
      ...prev,
      [id]: isSelected,
    };
  }, {}), [coordinates, selectedCoordinates]);

  const handleOnClick = (selectedId) => (e) => {
    const { shiftKey } = e;

    if (lastClicked && shiftKey) {
      const inBetweenIds = getInBetweenElements(coordinates.map(({ id }) => id), lastClicked, selectedId);
      onCoordinateSelect(e, inBetweenIds);

      setLastClicked(selectedId);
      return;
    }

    const isSelected = selectedCoordinatesMap[selectedId];

    // simple click
    setLastClicked(selectedId);
    if (isSelected) {
      onCoordinateDeSelect(e, [selectedId]);
    } else {
      onCoordinateSelect(e, [selectedId]);
    }
  };

  return (
    <List className={classes.list} {...props}>
      {coordinates.map((coordinate, i) => {
        const { id, lat, lng } = coordinate;
        return (
          <span key={`coordinate-item-${id}`}>
            <ListItem
              onClick={handleOnClick(id)}
              selected={selectedCoordinatesMap[id]}
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
                  checked={selectedCoordinates.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': id }}
                />
              </ListItemIcon>
            </ListItem>
            {i !== (coordinates.length - 1) && (
              <Divider key={`coordinate-item-divider-${id}`} />
            )}
          </span>
        );
      })}
    </List>
  );
};

CoordinatesPanel.propTypes = {
  coordinates: PropTypes.arrayOf(CoordinatePropType).isRequired,
  selectedCoordinates: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCoordinateSelect: PropTypes.func,
  onCoordinateDeSelect: PropTypes.func,
};

CoordinatesPanel.defaultProps = {
  onCoordinateSelect: () => {},
  onCoordinateDeSelect: () => {},
};

export default CoordinatesPanel;
