import React, { FC, ReactNode } from 'react';

import { makeStyles } from '@material-ui/core/styles';

type SideDrawerProps = {
  children: ReactNode,
}

const useStyles = makeStyles(() => ({
  drawer: {},
}));

const SideDrawer: FC<SideDrawerProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.drawer}>
      {children}
    </div>
  );
};

export default SideDrawer;
