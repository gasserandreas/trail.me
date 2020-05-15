/* global FileReader */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import PublishIcon from '@material-ui/icons/Publish';

import clsx from 'clsx';

import Panel, { SPACING } from '../Panel';
import DeleteButton from '../../DeleteButton/DeleteButton';
import MapFileType from '../../../constants/MapFileType';

import { waypointsIdsSelector } from '../../../entities/waypoints/selector';

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
}));

const FilePanel = ({
  filename,
  filetype,
  error,
  onFilenameChange,
  onFiletypeChange,
  onError,
  onClickReset,
  onClickUpload,
  onClickDownload,
  showUpload,
  showDownload,
  ...props
}) => {
  const classes = useStyles();
  const waypointsIds = useSelector(waypointsIdsSelector);

  const handleOnDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onerror = () => onError && onError(new Error('Could not download file.'));
    reader.onload = (e) => {
      const text = e.target.result;
      onClickUpload(e, text);
    };
    reader.readAsText(file);
  }, [onClickUpload, onError]);

  const handleOnDownloadClick = (e) => {
    if (waypointsIds.length === 0) {
      return;
    }

    onClickDownload(e);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleOnDrop,
  });

  return (
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
              onChange={onFilenameChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              value={filetype}
              onChange={onFiletypeChange}
              className={classes.select}
              disabled
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
        <DeleteButton size="small" onClick={onClickReset}>Reset</DeleteButton>
        {showUpload && (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button
              color="default"
              size="small"
              endIcon={<PublishIcon />}
              className={classes.buttonMargin}
            >
              Upload
            </Button>
          </div>
        )}
        {showDownload && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<SystemUpdateIcon />}
            className={classes.buttonMargin}
            onClick={handleOnDownloadClick}
            disabled={waypointsIds.length === 0}
          >
            Download
          </Button>
        )}
      </div>
      <div className={classes.spacing}>
        {error && (
          <Typography color="error">{error.message}</Typography>
        )}
      </div>
    </Panel>
  );
};

FilePanel.propTypes = {
  filename: PropTypes.string,
  filetype: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  showUpload: PropTypes.bool,
  showDownload: PropTypes.bool,
  onFilenameChange: PropTypes.func,
  onFiletypeChange: PropTypes.func,
  onError: PropTypes.func,
  onClickReset: PropTypes.func,
  onClickUpload: PropTypes.func,
  onClickDownload: PropTypes.func,
};

FilePanel.defaultProps = {
  filename: '',
  filetype: '',
  error: null,
  showUpload: false,
  showDownload: false,
  onFilenameChange: () => {},
  onFiletypeChange: () => {},
  onError: () => {},
  onClickReset: () => {},
  onClickUpload: () => {},
  onClickDownload: () => {},
};

export default FilePanel;
