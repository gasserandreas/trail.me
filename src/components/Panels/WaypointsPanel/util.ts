// eslint-disable-next-line import/prefer-default-export
export function getInBetweenElements<T>(array: Array<T>, a: T, b: T): Array<T> {
  const indexA = array.indexOf(a);
  const indexB = array.indexOf(b);

  return indexA < indexB ? array.slice(indexA, indexB + 1) : array.slice(indexB, indexA + 1);
}
