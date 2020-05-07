import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import { FRICK_VIEWPORT } from '../../Map/SwissGeoMap';

const useStyles = makeStyles(() => ({
  iconButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const CenterForm = ({ center, onChange }) => {
  const classes = useStyles();

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

  const { register, errors, getValues, setValue } = useForm({
    mode: 'onBlur',
    validationSchema: centerFormSchema,
    defaultValues: {
      lat: FRICK_VIEWPORT.center[0],
      lng: FRICK_VIEWPORT.center[1],
    },
  });

  const handleOnBlur = () => {
    if (Object.keys(errors).length !== 0) return;

    const { lat, lng } = getValues();
    const newCenter = {
      lat: Number(lat),
      lng: Number(lng),
    };

    onChange(newCenter);
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
          />
        </Grid>
        <Grid item xs={5}>
          <Input
            name="lng"
            margin="dense"
            inputRef={register}
            error={!!errors.lng}
          />
        </Grid>
        <Grid item xs={2}>
          <Box className={classes.iconButton}>
            <IconButton
              variant="contained"
              color="primary"
              size="small"
            >
              <GpsFixedIcon />
            </IconButton>
          </Box>
        </Grid>
        { (errors.lat || errors.lng) && (
          <Grid item xs={12}>
            <Typography color="error">Invalid center object</Typography>
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
};

export default CenterForm;
