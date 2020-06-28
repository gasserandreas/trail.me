import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import CenterForm from './CenterForm';

import Panel, { PanelContent, SPACING } from '../Panel';
import OptionButton from '../../OptionButton/OptionButton';

import { FRICK_VIEWPORT } from '../../Map/SwissGeoMap';
import MapActions from '../../../constants/MapActions';
import CustomMapActions from '../../../constants/CustomMapActions';

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
  mapAction,
  onCenterChange,
  onMapActionChange,
  onLocationUpdate,
  onCustomActionClick,
  ...props
}) => {
  const classes = useStyles();

  const handleMapActionClick = (newMapAction) => (e) => {
    if (onMapActionChange) {
      onMapActionChange(e, newMapAction);
    }
  };

  const handleOnLocationUpdate = (e, newCenter) => {
    if (onCenterChange) {
      onCenterChange(e, newCenter);
    }

    if (onLocationUpdate) {
      onLocationUpdate(e, newCenter);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const mapActionButtons = useMemo(() => Object.entries(MapActions).map(([_, value], i) => (
    <Button
      key={`mouse-action-button-${i}`}
      variant={mapAction === value ? 'contained' : 'outlined'}
      selected={mapAction === value}
      onClick={handleMapActionClick(value)}
    >
      {value}
    </Button>
    )), [mapAction, onMapActionChange]); // eslint-disable-line

  const moreActionsOptions = [
    {
      key: CustomMapActions.MORE_ACTIONS,
      value: 'More',
    },
    {
      key: CustomMapActions.INVERT_ROUTE,
      value: 'Invert route',
    },
  ];

  const handleOnMoreActionsClick = (e, value) => {
    const { key } = value;
    onCustomActionClick(e, key);
  };

  return (
    <Panel title="Map Information" {...props}>
      <PanelContent>
        <div className={classes.rowSpacing}>
          <Typography
            variant="caption"
            className={classes.section}
            gutterBottom
          >
            Map center
          </Typography>
          <CenterForm
            center={center}
            onChange={onCenterChange}
            onLocationUpdate={handleOnLocationUpdate}
          />
        </div>
        <div className={classes.rowSpacing}>
          <Typography
            variant="caption"
            className={classes.section}
            gutterBottom
          >
            Map Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <div>
                <ButtonGroup
                  color="primary"
                  size="small"
                  aria-label="small outlined primary button group"
                >
                  {mapActionButtons}
                </ButtonGroup>
              </div>
            </Grid>
            <Grid item xs={4}>
              <OptionButton
                options={moreActionsOptions}
                baseOptionIndex={0}
                color="default"
                size="small"
                variant="outlined"
                onClick={handleOnMoreActionsClick}
                className={classes.buttonMargin}
                hideOptionKeys={[CustomMapActions.MORE_ACTIONS]}
                disableButtonOnClick
              />
            </Grid>
          </Grid>
        </div>
      </PanelContent>
    </Panel>
  );
};

MapPanel.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  mapAction: PropTypes.string,
  onCenterChange: PropTypes.func,
  onMapActionChange: PropTypes.func,
  onLocationUpdate: PropTypes.func,
  onCustomActionClick: PropTypes.func,
};

MapPanel.defaultProps = {
  center: [FRICK_VIEWPORT.center[0], FRICK_VIEWPORT.center[1]],
  mapAction: MapActions.SELECT,
  onCenterChange: () => {},
  onMapActionChange: () => {},
  onLocationUpdate: () => {},
  onCustomActionClick: () => {},
};

export default MapPanel;
