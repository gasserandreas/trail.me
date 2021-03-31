import React, { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';

import clsx from 'clsx';

import Panel, { SPACING } from '../Panel';
import DeleteButton from '../../DeleteButton/DeleteButton';
import OptionButton from '../../OptionButton/OptionButton';
import MapFileType from '../../../constants/MapFileType';
import UploadOptions from '../../../constants/UploadOptions';
import { parseGpx, convertToGpxWaypoints, convertToGpx } from '../../../utils/gpx';

import { initNewRoute, addWaypoints } from '../../../entities/route-edit';
import { waypointsSelector, waypointsIdsSelector, splitEnabledSelector } from '../../../entities/route-edit/selector';

const INITIAL_FILENAME = 'export';

const useStyles = makeStyles(() => ({
  fileName: {
    width: '100%',
  },
  controls: {
    display: 'flex',
    padding: '1rem 0',
    justifyContent: 'flex-end',
  },
  buttonMargin: {
    marginLeft: '0.5rem',
  },
  spacing: {
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  select: {
    width: '100%',
  },
  downloadButton: {
    flexShrink: 0,
    flexGrow: 0,
  },
}));

const FilePanel = ({
  ...props
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const waypoints = useSelector(waypointsSelector);
  const waypointsIds = useSelector(waypointsIdsSelector);
  const splitEnabled = useSelector(splitEnabledSelector);

  const [uploadOption, setUploadOption] = useState(UploadOptions.RESET_UPLOAD);
  const [filename, setFilename] = useState(INITIAL_FILENAME);
  const [filetype, setFiletype] = useState(MapFileType.GPX);
  const [error, setError] = useState(null);

  const disabled = useMemo(() => splitEnabled, [splitEnabled]);

  const handleOnDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onerror = () => setError(new Error('Could not download file.'));
    reader.onload = (e) => {
      /**
       * parse text from upload
       */
      const text = e.target.result;
      const result = parseGpx(text);
      const { name, waypoints: parsedWaypoints } = result;

      setFilename(name);

      /**
       * process uploaded data
       */
      if (uploadOption === UploadOptions.RESET_UPLOAD) {
        // start new route
        dispatch(initNewRoute(name, parsedWaypoints));
      } else {
        // add waypoints
        dispatch(addWaypoints(parsedWaypoints));
      }
    };
    reader.readAsText(file);
  }, [uploadOption, dispatch]);

  const handleOnDownloadClick = async () => {
    if (disabled) return;
    if (waypointsIds.length === 0) return;

    /**
     * create download data
     */
    const gpxWaypoints = convertToGpxWaypoints(waypoints);
    const gpxString = await convertToGpx(filename, gpxWaypoints);

    const downloadName = `${filename}.${filetype}`;

    /**
     * Create new a tag to support download
     */
    const element = document.createElement('a');
    const file = new Blob([gpxString], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = downloadName;
    document.body.appendChild(element); // Required for this to work in FireFox

    // download file
    element.click();

    // remove a tag from body again
    setTimeout(() => {
      if (element) {
        document.body.removeChild(element);
      }
    }, 500);
  };

  const handleOnChangeFilename = (e) => {
    const { target: { value } } = e;
    setFilename(value);
  };

  const handleOnChangeFiletype = (e) => {
    const { target: { value } } = e;
    setFiletype(value);
  };

  const handleOnClickReset = () => {
    setFilename(INITIAL_FILENAME);
    dispatch(initNewRoute());
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: handleOnDrop,
    noClick: true,
    noKeyboard: true,
  });

  const uploadOptions = [
    {
      key: UploadOptions.RESET_UPLOAD,
      value: 'Upload',
    },
    {
      key: UploadOptions.CONCAT_UPLOAD,
      value: 'Upload concat',
    },
  ];

  const handleOnUploadClick = (e, value) => {
    if (disabled) return;

    const { key } = value;
    setUploadOption(key);

    // open file upload
    open();
  };

  return (
    <>
      <input type="hidden" style={{ visability: 'none' }} id="filedownload" />
      <Panel {...props}>
        <div className={classes.spacing}>
          <Typography variant="caption" id="filename" gutterBottom>
            File name
          </Typography>
          <Grid container justify="space-between" spacing={1}>
            <Grid item xs={9}>
              <TextField
                id="filename"
                className={classes.fileName}
                value={filename}
                onChange={handleOnChangeFilename}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                value={filetype}
                onChange={handleOnChangeFiletype}
                className={classes.select}
                disabled={true || disabled} // TODO: enabled option button later to support different filetypes
              >
                {Object.entries(MapFileType).map(([_, value]) => ( // eslint-disable-line no-unused-vars
                  <MenuItem key={`filetype-${value}`} value={value}>
                    {'.'}
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </div>
        <div className={clsx(classes.controls, classes.spacing)}>
          <DeleteButton size="small" onClick={handleOnClickReset} disabled={disabled}>Reset</DeleteButton>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <OptionButton
              options={uploadOptions}
              baseOptionIndex={0}
              color="default"
              size="small"
              variant="outlined"
              onClick={handleOnUploadClick}
              className={classes.buttonMargin}
              disabled={disabled}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<SystemUpdateIcon />}
            className={clsx(classes.buttonMargin, classes.downloadButton)}
            onClick={handleOnDownloadClick}
            disabled={disabled || waypointsIds.length === 0}
          >
            Download
          </Button>
        </div>
        <div className={classes.spacing}>
          {error && (
            <Typography color="error">{error.message}</Typography>
          )}
        </div>
      </Panel>
    </>
  );
};

FilePanel.propTypes = {};

FilePanel.defaultProps = {};

export default FilePanel;
