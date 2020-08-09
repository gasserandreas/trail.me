import React from 'react';
import { useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { SPACING } from '../Panel';

import { splitEnabledSelector } from '../../../entities/route-edit/selector';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '2rem',
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  heading: {
    paddingBottom: '0.75rem',
  },
}));

const EmptyPanel = () => {
  const classes = useStyles();

  const splitEnabled = useSelector(splitEnabledSelector);

  return (
    <Box className={classes.root}>
      {splitEnabled ? (
        <>
          <Typography
            variant="h3"
            color="primary"
            className={classes.heading}
          >
            Add new points in between
          </Typography>
          <Typography variant="body2">
            No new waypoints were added, start adding waypoints in between existing waypoints.
          </Typography>
        </>
      ) : (
        <>
          <Typography
            variant="h3"
            color="primary"
            className={classes.heading}
          >
            Start your next Trail
          </Typography>
          <Typography variant="body2">
            No waypoints were added to your trail so far, start planning right now.
          </Typography>
        </>
      )}
    </Box>
  );
};

export default EmptyPanel;
