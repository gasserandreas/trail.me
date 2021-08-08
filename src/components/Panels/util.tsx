/* eslint-disable import/prefer-default-export */
import React, { ReactNode } from 'react';

export const ActionPanel = (story: () => ReactNode) => {
  const styles = {
    width: '400px',
    backgroundColor: '#fff',
    display: 'block',
    margin: '0 auto',
  };

  return <div style={styles}>{story()}</div>;
};
