import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import CenterForm from './CenterForm';

import Panel, { PanelContent, SPACING } from '../Panel';
import OptionButton from '../../OptionButton/OptionButton';

import MapActions from '../../../constants/MapActions';
import CustomMapActions from '../../../constants/CustomMapActions';

import { setViewport, setLocation } from '../../../entities/map';
import { viewportSelector } from '../../../entities/map/selector';

import { setActionType, invertWaypoints } from '../../../entities/route-edit';
import { actionTypeSelector } from '../../../entities/route-edit/selector';

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

const MapPanel = ({ ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const viewport = useSelector(viewportSelector);
  const actionType = useSelector(actionTypeSelector);

  const center = useMemo(() => viewport.center, [viewport]);

  const handleMapActionClick = (newActionType) => () => {
    dispatch(setActionType(newActionType));
  };

  const onCenterChange = (_, newCenter) => {
    const newViewport = {
      ...viewport,
      center: newCenter,
    };
    dispatch(setViewport(newViewport));
  };

  const handleOnLocationUpdate = (e, newCenter) => {
    if (onCenterChange) {
      onCenterChange(e, newCenter);
    }

    dispatch(setLocation(newCenter));
  };

  // eslint-disable-next-line no-unused-vars
  const mapActionButtons = useMemo(() => Object.entries(MapActions).map(([_, value], i) => (
    <Button
      key={`mouse-action-button-${i}`}
      variant={actionType === value ? 'contained' : 'outlined'}
      selected={actionType === value}
      onClick={handleMapActionClick(value)}
    >
      {value}
    </Button>
  )), [actionType]); // eslint-disable-line

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
    switch (value.key) {
      default:
        dispatch(invertWaypoints());
    }
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

MapPanel.propTypes = {};

MapPanel.defaultProps = {};

export default MapPanel;
