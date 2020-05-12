import * as uuid from 'uuid';

export const createWaypoint = (data, meta = { selected: false }) => ({
  id: uuid.v4(),
  ...data,
  meta,
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

export const createChunkArray = (array, chunkSize = 100) => {
  if (!array || array.length === 0) {
    return array;
  }

  const chunkArrays = [];

  const numberOfChunks = Math.trunc(array.length / chunkSize);
  const modelo = array.length % chunkSize;

  let arrayIndex = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numberOfChunks; i++) {
    chunkArrays.push(array.slice(arrayIndex, arrayIndex + chunkSize));
    arrayIndex += chunkSize;
  }

  if (modelo !== 0) {
    chunkArrays.push(array.slice(arrayIndex, arrayIndex + modelo));
  }

  return chunkArrays;
};

export const generateSelectState = (state, newIds, value) => ({
  ...state,
  ...newIds.reduce((prev, cur) => ({
    ...prev,
    [cur]: {
      value,
    },
  }), {}),
});
