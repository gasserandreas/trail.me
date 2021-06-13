import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export const SPACING = '1rem';

const useStyles = makeStyles(() => ({
  panel: {
    overflow: 'hidden',
    display: 'flex',
    flexFlow: 'column',
  },
  panelSpacing: {
    paddingTop: SPACING / 2,
    paddingBottom: SPACING / 2,
  },
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  title: {
    fontWeight: 600,
  },
  divider: {
    margin: '0.5rem 0 0.75rem',
  },
}));

export const PanelContent = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={classes.spacing} {...props}>
      {children}
    </div>
  );
};

PanelContent.propTypes = {
  children: PropTypes.node.isRequired,
};

const Panel = ({ title, children, noSpacing, ...props }) => {
  const classes = useStyles();

  const panelClassName = noSpacing ? classes.panel : clsx(classes.panel, classes.panelSpacing);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box {...props} className={panelClassName}>
      {title && (
        <Typography variant="h6" className={clsx(classes.spacing, classes.title)}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

Panel.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  noSpacing: PropTypes.bool,
};

Panel.defaultProps = {
  title: null,
  noSpacing: false,
};

export default Panel;
