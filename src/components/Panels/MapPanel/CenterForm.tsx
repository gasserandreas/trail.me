import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import { FRICK_VIEWPORT } from '../../../ui/Map/SwissGeoMap';
import { getLocation } from '../../../utils/geolocation';

const useStyles = makeStyles(() => ({
  iconButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const centerFormSchema = yup.object().shape({
  lat: yup.number().min(-90).max(90).required(),
  lng: yup.number().min(-180).max(180).required(),
});

type CenterFormProps = {
  center: number[];
  onChange: (event: React.FocusEvent<HTMLInputElement>, center: ViewPortCoordinates) => void;
  onLocationUpdate: (
    event: React.MouseEvent<HTMLButtonElement>,
    center: ViewPortCoordinates,
  ) => void;
  onLocationClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const CenterForm: FC<CenterFormProps> = ({
  center,
  onChange,
  onLocationClick,
  onLocationUpdate,
}) => {
  const classes = useStyles();
  const [locationPending, setLocationPending] = useState(false);
  const [locationError, setLocationError] = useState<Error | null>(null);

  const formik = useFormik({
    initialValues: {
      lat: FRICK_VIEWPORT.center[0],
      lng: FRICK_VIEWPORT.center[1],
    },
    validationSchema: centerFormSchema,
    onSubmit: () => {},
  });

  const { errors, values, setValues, handleBlur, handleChange } = formik;

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (Object.keys(errors).length !== 0) return;

    const { lat, lng } = values;
    const newCenter: ViewPortCoordinates = [Number(lat), Number(lng)];

    onChange(event, newCenter);

    handleBlur(event);
  };

  const handleOnLocationClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onLocationClick) {
      onLocationClick(event);
    }

    setLocationError(null);

    try {
      setLocationPending(true);
      const location = await getLocation();
      const {
        coords: { latitude, longitude },
      } = location;

      setLocationPending(false);

      const newLocation: ViewPortCoordinates = [latitude, longitude];
      onLocationUpdate(event, newLocation);
    } catch {
      const error = new Error('Could not load Location');
      setLocationPending(false);
      setLocationError(error);
    }
  };

  useEffect(() => {
    const [lat, lng] = center;
    setValues({
      lat,
      lng,
    });
  }, [center]); // eslint-disable-line

  return (
    <form>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={5}>
          <Input
            name="lat"
            margin="dense"
            value={values.lat}
            onChange={handleChange}
            error={!!errors.lat}
            onBlur={handleOnBlur}
            disabled={locationPending}
            type="number"
          />
        </Grid>
        <Grid item xs={5}>
          <Input
            name="lng"
            margin="dense"
            value={values.lng}
            onChange={handleChange}
            error={!!errors.lng}
            disabled={locationPending}
            type="number"
          />
        </Grid>
        <Grid item xs={2}>
          <Box className={classes.iconButton}>
            {locationPending ? (
              <CircularProgress size={24} />
            ) : (
              <IconButton
                // variant="contained"
                color="primary"
                size="small"
                onClick={handleOnLocationClick}
              >
                <GpsFixedIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
        {(errors.lat || errors.lng) && (
          <Grid item xs={12}>
            <Typography color="error">Invalid center object</Typography>
          </Grid>
        )}
        {locationError && (
          <Grid item xs={12}>
            <Typography color="error">{locationError.message}</Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default CenterForm;
