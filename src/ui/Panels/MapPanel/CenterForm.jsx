import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import { FRICK_VIEWPORT } from '../../Map/SwissGeoMap';
import { getLocation } from '../../../utils/geolocation';

const useStyles = makeStyles(() => ({
  iconButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const CenterForm = ({
  center, onChange, onLocationClick, onLocationUpdate
}) => {
  const classes = useStyles();
  const [locationPending, setLocationPending] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const centerFormSchema = yup.object().shape({
    lat: yup
      .number()
      .min(-90)
      .max(90)
      .required(),
    lng: yup
      .number()
      .min(-180)
      .max(180)
      .required(),
  });

  const {
    register, errors, getValues, setValue
  } = useForm({
    mode: 'onBlur',
    validationSchema: centerFormSchema,
    defaultValues: {
      lat: FRICK_VIEWPORT.center[0],
      lng: FRICK_VIEWPORT.center[1],
    },
  });

  const handleOnBlur = (e) => {
    if (Object.keys(errors).length !== 0) return;

    const { lat, lng } = getValues();
    const newCenter = {
      lat: Number(lat),
      lng: Number(lng),
    };

    onChange(e, newCenter);
  };

  const handleOnLocationClick = async (e) => {
    if (onLocationClick) {
      onLocationClick(e);
    }

    setLocationError(null);

    try {
      setLocationPending(true);
      const location = await getLocation();
      const { coords: { latitude, longitude } } = location;

      setLocationPending(false);

      const newLocation = {
        lat: latitude,
        lng: longitude,
      };
      onLocationUpdate(e, newLocation);
    } catch (error) {
      setLocationPending(false);
      setLocationError(error);
    }
  };

  useEffect(() => {
    setValue([
      { lat: center.lat },
      { lng: center.lng },
    ]);
  }, [center]); // eslint-disable-line

  return (
    <form>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={5}>
          <Input
            name="lat"
            margin="dense"
            inputRef={register}
            error={!!errors.lat}
            onBlur={handleOnBlur}
            disabled={locationPending}
          />
        </Grid>
        <Grid item xs={5}>
          <Input
            name="lng"
            margin="dense"
            inputRef={register}
            error={!!errors.lng}
            disabled={locationPending}
          />
        </Grid>
        <Grid item xs={2}>
          <Box className={classes.iconButton}>
            {locationPending ? (
              <CircularProgress size={24} />
            ) : (
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={handleOnLocationClick}
              >
                <GpsFixedIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
        { (errors.lat || errors.lng) && (
          <Grid item xs={12}>
            <Typography color="error">Invalid center object</Typography>
          </Grid>
        )}
        { locationError && (
          <Grid item xs={12}>
            <Typography color="error">{locationError}</Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

CenterForm.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func,
  onLocationUpdate: PropTypes.func.isRequired,
};

CenterForm.defaultProps = {
  onLocationClick: () => {},
};

export default CenterForm;
