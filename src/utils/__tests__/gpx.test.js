import * as gpx from '../gpx';

describe('utils/gpx test suite', () => {
  describe('utils/gpx/convertToGpxWaypoints test suite', () => {
    const mockedWaypoint = {
      lat: 47.50424,
      lng: 8.026628,
      elevation: 100,
      time: '2020-08-07T07:36:55Z',
    };

    it('should return converted waypoints array', () => {
      expect(gpx.convertToGpxWaypoints([mockedWaypoint]))
        .toEqual([
          {
            latitude: mockedWaypoint.lat,
            longitude: mockedWaypoint.lng,
            elevation: mockedWaypoint.elevation,
            time: mockedWaypoint.time,
          },
        ]);
    });

    it('should return converted waypoints array with default values', () => {
      const updatedMockedWaypoint = {
        lat: mockedWaypoint.lat,
        lng: mockedWaypoint.lng,
      };

      expect(gpx.convertToGpxWaypoints([updatedMockedWaypoint]))
        .toEqual([
          {
            latitude: updatedMockedWaypoint.lat,
            longitude: updatedMockedWaypoint.lng,
            elevation: 0,
            time: '',
          },
        ]);
    });
  });

  describe('utils/gpx/convertToGpx test suite', () => {
    it('should convert data to gpx string', async () => {
      const name = 'test name';
      const waypoints = [
        {
          latitude: 47.50424,
          longitude: 8.026628,
          elevation: 100,
          time: '2020-08-07T07:36:55Z',
        },
      ];

      const gpxString = await gpx.convertToGpx(name, waypoints);
      expect(gpxString).toMatchSnapshot();

      expect(gpxString).toContain('trail.me');
    });
  });

  describe('utils/gpx/getValue test suite', () => {
    const parser = new DOMParser();

    const xmlProperty = `
      <trkpt lat="47.50424" lon="8.026628">
        <ele>100</ele>
        <time>2020-08-07T07:36:55Z</time>
      </trkpt>
    `;

    const xmlPropertyWithoutEleTime = `
      <trkpt lat="47.50424" lon="8.026628"></trkpt>
    `;

    const xmlPropertyEmptyEle = `
      <trkpt lat="47.50424" lon="8.026628">
        <ele></ele>
      </trkpt>
    `;

    it('should return value', () => {
      const xml = parser.parseFromString(xmlProperty, 'text/xml');

      expect(gpx.__testables__.getValue(xml, 'ele', 0))
        .toEqual('100');

      expect(gpx.__testables__.getValue(xml, 'time', ''))
        .toEqual('2020-08-07T07:36:55Z');
    });

    it('should return default value for missing properties', () => {
      const xml = parser.parseFromString(xmlPropertyWithoutEleTime, 'text/xml');
      expect(gpx.__testables__.getValue(xml, 'ele', 0)).toEqual(0);
    });

    it('should return default value for empty properties', () => {
      const xml = parser.parseFromString(xmlPropertyEmptyEle, 'text/xml');
      expect(gpx.__testables__.getValue(xml, 'ele', 0)).toEqual(0);
    });

    it('should return function default value', () => {
      const xml = parser.parseFromString(xmlPropertyWithoutEleTime, 'text/xml');
      expect(gpx.__testables__.getValue(xml, 'ele')).toEqual('');
    });
  });

  describe('utils/gpx/parseGpx test suite', () => {
    /* eslint-disable max-len */
    const mockedXmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <gpx creator="trail.me" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v2 http://www.garmin.com/xmlschemas/TrackPointExtensionv2.xsd">
      <metadata>
        <name>test name</name>
      </metadata>
      <trk>
        <name>test name</name>
        <trkseg>
          <trkpt lat="47.50424" lon="8.026628">
            <ele>100</ele>
            <time>2020-08-07T07:36:55Z</time>
          </trkpt>
          <trkpt lat="47.50423" lon="8.026627" />
        </trkseg>
      </trk>
    </gpx>`;
    /* eslint-enable max-len */

    it('should convert xml to data', () => {
      const { name, waypoints } = gpx.parseGpx(mockedXmlString);
      expect(name).toEqual('test name');
      expect(waypoints).toEqual([
        {
          lat: 47.50424,
          lng: 8.026628,
          elevation: 100,
          time: '2020-08-07T07:36:55Z',
        },
        {
          lat: 47.50423,
          lng: 8.026627,
          elevation: 0,
          time: '',
        },
      ]);
    });
  });
});
