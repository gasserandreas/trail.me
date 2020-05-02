/* eslint-disable import/prefer-default-export */
import React from 'react';

export const ActionPanel = (story) => {
  const styles = {
    width: '400px',
    backgroundColor: '#fff',
    position: 'relative',
    display: 'block',
    margin: '0 auto',
  };

  return (
    <div style={styles}>
      {story()}
    </div>
  );
};
