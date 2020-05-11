/* global Blob */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FilePanel from '../../ui/Panels/FilePanel/FilePanel';
import MapFileType from '../../constants/MapFileType';

import { resetWaypoints, loadWaypoints } from '../../entities/waypoints';
import { waypointsSelector } from '../../entities/waypoints/selector';

import { parseGpx, convertToGpxWaypoints, convertToGpx } from '../../utils/gpx';

const INITIAL_FILENAME = 'export';

const ConnectedFilePanel = () => {
  const dispatch = useDispatch();
  const waypoints = useSelector(waypointsSelector);

  const [filename, setFilename] = useState(INITIAL_FILENAME);
  const [filetype, setFiletype] = useState(MapFileType.GPX);
  const [error, setError] = useState(null);

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
    dispatch(resetWaypoints());
  };

  const handleOnClickDownload = async () => {
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
  };

  const handleOnClickUpload = (_, text) => {
    const result = parseGpx(text);
    const { name, waypoints: parsedWaypoints } = result;

    setFilename(name);
    dispatch(loadWaypoints(parsedWaypoints));
  };

  const handleOnError = (newError) => {
    setError(newError);
  };

  return (
    <>
      <input type="hidden" style={{ visability: 'none' }} id="filedownload" />
      <FilePanel
        filename={filename}
        filetype={filetype}
        error={error}
        onFilenameChange={handleOnChangeFilename}
        onFiletypeChange={handleOnChangeFiletype}
        onError={handleOnError}
        onClickReset={handleOnClickReset}
        onClickUpload={handleOnClickUpload}
        onClickDownload={handleOnClickDownload}
        showDownload
        showUpload
      />
    </>
  );
};

export default ConnectedFilePanel;
