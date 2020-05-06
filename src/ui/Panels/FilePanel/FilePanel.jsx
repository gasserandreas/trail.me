/* global FileReader */
import React, { useCallback } from 'react';
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
import MapFileType from '../../../constants/MapFileType';

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
  onFilenameChange,
  onFiletypeChange,
  onClickReset,
  onClickUpload,
  onClickDownload,
  showUpload,
  showDownload,
  ...props
}) => {
  const classes = useStyles();

  const handleOnDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted'); // eslint-disable-line no-console
      reader.onerror = () => console.log('file reading has failed'); // eslint-disable-line no-console
      reader.onload = (e) => {
        const text = e.target.result;
        onClickUpload(e, text);
      };
      // reader.readAsArrayBuffer(file)
      reader.readAsText(file);
    });
  }, [onClickUpload]);

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
        <Button size="small" onClick={onClickReset}>Reset</Button>
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
            onClick={onClickDownload}
          >
            Download
          </Button>
        )}
      </div>
    </Panel>
  );
};

FilePanel.propTypes = {
  filename: PropTypes.string,
  filetype: PropTypes.string,
  showUpload: PropTypes.bool,
  showDownload: PropTypes.bool,
  onFilenameChange: PropTypes.func,
  onFiletypeChange: PropTypes.func,
  onClickReset: PropTypes.func,
  onClickUpload: PropTypes.func,
  onClickDownload: PropTypes.func,
};

FilePanel.defaultProps = {
  filename: '',
  filetype: '',
  showUpload: false,
  showDownload: false,
  onFilenameChange: () => {},
  onFiletypeChange: () => {},
  onClickReset: () => {},
  onClickUpload: () => {},
  onClickDownload: () => {},
};

export default FilePanel;
