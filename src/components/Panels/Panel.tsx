import React, { FC, ReactNode } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export const SPACING = 1;

const useStyles = makeStyles(() => ({
  panel: {
    overflow: 'hidden',
    display: 'flex',
    flexFlow: 'column',
  },
  panelSpacing: {
    paddingTop: `${SPACING / 2}rem`,
    paddingBottom: `${SPACING / 2}rem`,
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

export type PanelContentProps = {
  children: ReactNode;
};

export const PanelContent: FC<PanelContentProps> = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.spacing} {...props}>
      {children}
    </div>
  );
};

export type PanelProps = {
  title?: ReactNode;
  noSpacing?: boolean;
  children: ReactNode;
};

const Panel: FC<PanelProps> = ({ title = null, children, noSpacing = false, ...props }) => {
  const classes = useStyles();

  const panelClassName = noSpacing ? classes.panel : clsx(classes.panel, classes.panelSpacing);

  return (
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

export default Panel;
