// eslint-disable-next-line import/prefer-default-export
export function getLocation() {
  return new Promise((resolve, reject) => {
    // check if geolocation is supported
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // resolve new geo location
          resolve(position);
        },
        (error) => {
          reject(error);
        },
      );
    } else {
      reject(new Error('Geolocation is not supported / enabled'));
    }
  });
}
