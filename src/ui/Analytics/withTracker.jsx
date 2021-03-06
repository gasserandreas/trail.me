/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

import { useIsDev } from '../../config/AppContext';

const gaId = 'UA-168721449-1';

ReactGA.initialize(gaId);

const withTracker = (WrappedComponent, options = {
  anonymizeIp: true,
}) => {
  const trackPage = (page) => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = (props) => {
    const isDev = useIsDev();

    useEffect(() => {
      if (!isDev) {
        trackPage(props.location.pathname);
      }
    }, [props.location.pathname, isDev]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default withTracker;
