/* global FileReader */
import React, { useCallback, useState } from 'react';
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

import clsx from 'clsx';

import Panel, { SPACING } from '../Panel';
import DeleteButton from '../../DeleteButton/DeleteButton';
import OptionButton from '../../OptionButton/OptionButton';
import MapFileType from '../../../constants/MapFileType';
import UploadOptions from '../../../constants/UploadOptions';

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
  waypointsIds,
  ...props
}) => {
  const classes = useStyles();
  const [uploadOption, setUploadOption] = useState(UploadOptions.RESET_UPLOAD);

  const handleOnDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onerror = () => onError && onError(new Error('Could not download file.'));
    reader.onload = (e) => {
      const text = e.target.result;

      // callback text and selected upload option
      onClickUpload(e, {
        text,
        uploadOption,
      });
    };
    reader.readAsText(file);
  }, [onClickUpload, uploadOption, onError]);

  const handleOnDownloadClick = (e) => {
    if (waypointsIds.length === 0) {
      return;
    }

    onClickDownload(e);
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
    const { key } = value;
    setUploadOption(key);

    // open file upload
    open();
  };

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
            <OptionButton
              options={uploadOptions}
              baseOptionIndex={0}
              color="default"
              size="small"
              variant="outlined"
              onClick={handleOnUploadClick}
              className={classes.buttonMargin}
            />
          </div>
        )}
        {showDownload && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<SystemUpdateIcon />}
            className={clsx(classes.buttonMargin, classes.downloadButton)}
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
  waypointsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
