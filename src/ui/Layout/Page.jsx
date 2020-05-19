import React from 'react';
import PropTypes from 'prop-types';
import { withHotKeys } from 'react-hotkeys';

import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  page: {
    display: 'flex',
    height: '100%',
  },
}));

const Page = ({
  children, className, hotKeys, ...props
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.page, className)} {...hotKeys} {...props}>
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  handlers: PropTypes.shape({}),
  hotKeys: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

Page.defaultProps = {
  className: '',
  handlers: null,
  hotKeys: null,
};

export default withHotKeys(Page);


// const HOCPage = ({ handlers, ...props }) => {
//   if (!handlers) {
//     return <Page {...props} />;
//   }

//   return withHotKeys(<Page handlers={handlers} {...props} />);
// };

// HOCPage.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
//   handlers: PropTypes.shape({}),
// };

// HOCPage.defaultProps = {
//   className: '',
//   handlers: null,
// };

// export default HOCPage;
