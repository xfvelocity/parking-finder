export const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const calculateArea = (
  northeastLat: number,
  northeastLng: number,
  southwestLat: number,
  southwestLng: number
): number => {
  const R = 6371000; // Radius of the Earth in meters

  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  northeastLat = toRadians(northeastLat);
  northeastLng = toRadians(northeastLng);
  southwestLat = toRadians(southwestLat);
  southwestLng = toRadians(southwestLng);

  // Calculate the distances
  const northSouthDistance = (northeastLat - southwestLat) * R;
  const eastWestDistance =
    (northeastLng - southwestLng) *
    R *
    Math.cos((northeastLat + southwestLat) / 2);

  // Calculate the area
  const area = Math.abs(northSouthDistance * eastWestDistance);

  return Math.ceil(Math.sqrt(area / Math.PI));
};
