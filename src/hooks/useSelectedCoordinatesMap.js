import { useMemo } from 'react';

export default function useSelectedCoordinatesMap(waypoints, selectedWaypoints) {
  // pre-calculate selected coordinates map
  return useMemo(
    () =>
      waypoints.reduce((prev, cur) => {
        const { id } = cur;
        const isSelected = selectedWaypoints.includes(id);

        return {
          ...prev,
          [id]: isSelected,
        };
      }, {}),
    [waypoints, selectedWaypoints],
  );
}
