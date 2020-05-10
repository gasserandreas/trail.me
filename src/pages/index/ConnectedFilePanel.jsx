import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import FilePanel from '../../ui/Panels/FilePanel/FilePanel';
import MapFileType from '../../constants/MapFileType';

import { resetWaypoints, loadWaypoints } from '../../entities/waypoints';

import { parseGpx } from '../../utils/gpx';

const INITIAL_FILENAME = 'export';

const ConnectedFilePanel = () => {
  const dispatch = useDispatch();

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

  const handleOnClickDownload = async () => {};

  const handleOnClickUpload = (_, text) => {
    const result = parseGpx(text);
    const { name, waypoints } = result;

    setFilename(name);
    dispatch(loadWaypoints(waypoints));
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
