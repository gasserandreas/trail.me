// eslint-disable-next-line import/prefer-default-export
export function shortenCoordinate(text) {
  if (!text) {
    return '';
  }

  return text.substring(0, 8);
}
