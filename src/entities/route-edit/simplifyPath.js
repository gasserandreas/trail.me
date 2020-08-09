/* eslint-disable no-plusplus */
/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
export function getSqDist(p1, p2) {
  const dlat = p1.lat - p2.lat;
  const dlng = p1.lng - p2.lng;

  return dlat * dlat + dlng * dlng;
}

// square distance from a point to a segment
export function getSqSegDist(p, p1, p2) {
  let { lat } = p1;
  let { lng } = p1;
  let dlat = p2.lat - lat;
  let dlng = p2.lng - lng;

  if (dlat !== 0 || dlng !== 0) {
    const t = ((p.lat - lat) * dlat + (p.lng - lng) * dlng) / (dlat * dlat + dlng * dlng);

    if (t > 1) {
      lat = p2.lat;
      lng = p2.y;
    } else if (t > 0) {
      lat += dlat * t;
      lng += dlng * t;
    }
  }

  dlat = p.lat - lat;
  dlng = p.lng - lng;

  return dlat * dlat + dlng * dlng;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
export function simplifyRadialDist(points, sqTolerance) {
  let prevPoint = points[0];
  const newPoints = [prevPoint];
  let point;

  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i];

    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) newPoints.push(point);

  return newPoints;
}

export function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance;
  let index;

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
export function simplifyDouglasPeucker(points, sqTolerance) {
  const last = points.length - 1;

  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);

  return simplified;
}

// both algorithms combined for awesome performance
export default function simplify(points, tolerance, highestQuality) {
  if (points.length <= 2) return points;

  let newPoints;

  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

  newPoints = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
  newPoints = simplifyDouglasPeucker(newPoints, sqTolerance);

  return newPoints;
}
