import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CenterForm from './CenterForm';

import Panel, { PanelContent, SPACING } from '../Panel';
import { FRICK_VIEWPORT } from '../../Map/SwissGeoMap';

const useStyles = makeStyles((theme) => ({
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  rowSpacing: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  section: {
    paddingBottom: '0.25rem',
    marginBottom: `${theme.spacing(2)}px`,
  },
  iconButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const MapPanel = ({
  center,
  onCenterChange,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Panel title="Map Information" {...props}>
      <PanelContent>
        <div className={classes.rowSpacing}>
          <Typography
            variant="caption text"
            className={classes.section}
            gutterBottom
          >
            Map center
          </Typography>
          <CenterForm
            center={center}
            onChange={onCenterChange}
          />
        </div>
      </PanelContent>
    </Panel>
  );
};

MapPanel.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  onCenterChange: PropTypes.func,
};

MapPanel.defaultProps = {
  center: {
    lat: FRICK_VIEWPORT.center[0],
    lng: FRICK_VIEWPORT.center[1],
  },
  onCenterChange: () => {},
};

export default MapPanel;
