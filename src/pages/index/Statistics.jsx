import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

import {
  statisticsDistanceSelector,
  // statisticsNumberOfCoordinatesSelector,
  statisticsTimeSelector,
  statisticsHeightSelector,
  statisticsPendingSelector,
} from '../../entities/statistics/selector';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    padding: '0.5rem',
    flexWrap: 'wrap',
  },
  item: {
    display: 'flex',
    marginRight: '1rem',
  },
  text: {
    marginLeft: '0.25rem',
    fontSize: '0.9rem',
  },
  icon: {
    width: '1.1rem',
    height: '1.1rem',
  },
});

/**
 * util methods
 */
function renderDistance(distance) {
  if (!distance) {
    return 'n/a';
  }

  return `${Math.round(distance) / 1000}km`;
}

function renderUpDown(value) {
  if (!value) {
    return 'n/a';
  }

  return `${value}m`;
}

function renderTime(timeObject) {
  return moment(timeObject).format('HH:mm');
}

const Statistics = () => {
  const classes = useStyles();

  const pending = useSelector(statisticsPendingSelector);
  const distance = useSelector(statisticsDistanceSelector);
  // const numberOfCoordinates = useSelector(statisticsNumberOfCoordinatesSelector);
  const { start, end } = useSelector(statisticsTimeSelector);
  const { up, down } = useSelector(statisticsHeightSelector);

  const items = [
    {
      icon: <SwapHorizIcon className={classes.icon} />,
      value: renderDistance(distance),
    },
  ];

  if (up) {
    items.push({
      icon: <ArrowUpwardIcon className={classes.icon} />,
      value: renderUpDown(up),
    });
  }

  if (down) {
    items.push({
      icon: <ArrowDownwardIcon className={classes.icon} />,
      value: renderUpDown(down),
    });
  }

  if (start) {
    items.push({
      icon: <Typography className={classes.text}>Start: </Typography>,
      value: renderTime(start),
    });
  }

  if (end) {
    items.push({
      icon: <Typography className={classes.text}>End: </Typography>,
      value: renderTime(end),
    });
  }

  return (
    <Box className={classes.wrapper}>
      {/* <Typography className={classes.text}>Stats: </Typography> */}
      {pending
        ? <CircularProgress size={24} />
        : items.map(({ icon, value }, i) => (
          <Box className={classes.item} key={`stat-item-${i}`}>
            {icon}
            <Typography className={classes.text}>{value}</Typography>
          </Box>
        ))}
    </Box>
  );
};

export default Statistics;
