import createGpx from 'gps-to-gpx';

export const convertToGpxWaypoints = (waypoints) =>
  waypoints.map(({ lat, lng, elevation, time }) => ({
    latitude: lat,
    longitude: lng,
    elevation: elevation || 0,
    time: time || '',
  }));

export const convertToGpx = async (name, waypoints) => {
  const gpx = await createGpx(waypoints, {
    activityName: name,
    startTime: '',
  });

  const newGpx = gpx.replace(
    'GPS to GPX (https://npm.im/gps-to-gpx)',
    'trail.me'
  );

  return newGpx;
};

function getValue(xml, tag, defaultValue = '') {
  const elementXml = xml.querySelector(tag);

  if (!elementXml) {
    return defaultValue;
  }

  return elementXml.innerHTML || defaultValue;
}

export const parseGpx = (text) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');

  const name = xml.querySelector('name').innerHTML;

  const allTrkpt = xml.querySelectorAll('trkpt');

  const waypoints = [];
  allTrkpt.forEach((trkpt) => {
    const lat = trkpt.getAttribute('lat');
    const lon = trkpt.getAttribute('lon');

    const ele = getValue(trkpt, 'ele', 0);
    const time = getValue(trkpt, 'time', '');

    waypoints.push({
      lat: Number(lat),
      lng: Number(lon),
      elevation: Number(ele),
      time,
    });
  });

  return {
    name,
    waypoints,
  };
};

export const TESTABLES = {
  getValue,
};
