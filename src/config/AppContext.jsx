import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext(null);

export function useIsDev() {
  const context = useContext(AppContext) || {};

  return context.isDev || false;
}

export const AppContextProvider = ({ children, isDev }) => {
  const contextController = {
    isDev,
  };

  return <AppContext.Provider value={contextController}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isDev: PropTypes.bool,
};

AppContextProvider.defaultProps = {
  isDev: false,
};

export default AppContext;
