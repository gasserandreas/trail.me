import * as uuid from 'uuid';

export const createWaypoint = (data) => ({
  id: uuid.v4(),
  ...data,
});

export const createUniqueArray = (array, newIds = []) => [...new Set([...array, ...newIds])];

export const addWaypointIdsInBetween = (array, newIds, prev, next) => {
  if (!array || !newIds) {
    return [];
  }

  if (newIds.length === 0) {
    return array;
  }

  if (!prev || !next) {
    return createUniqueArray(array, newIds);
  }

  const sliceAt = array.indexOf(prev) + 1;

  const part1 = array.slice(0, sliceAt);
  const part2 = array.slice(sliceAt);

  return createUniqueArray([...part1, ...newIds, ...part2]);
};
