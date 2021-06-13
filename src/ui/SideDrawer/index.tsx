import React, { FC, ReactNode } from 'react';

import { makeStyles } from '@material-ui/core/styles';

type SideDrawerProps = {
  children: ReactNode;
};

const useStyles = makeStyles(() => ({
  drawer: {},
}));

const SideDrawer: FC<SideDrawerProps> = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    // eslint-disable-next-line
    <div className={classes.drawer} {...props}>
      {children}
    </div>
  );
};

export default SideDrawer;
