// eslint-disable-next-line import/prefer-default-export
export function getInBetweenElements(array, a, b) {
  const indexA = array.indexOf(a);
  const indexB = array.indexOf(b);

  return indexA < indexB
    ? array.slice(indexA, indexB + 1)
    : array.slice(indexB, indexA + 1);
}
