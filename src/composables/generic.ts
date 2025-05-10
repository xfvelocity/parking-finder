import type { SelectOption } from "@/types/app.types";

export const getImageUrl = (filename: string): string => {
  const path = `/src/assets/${filename}`;
  const imageModules = import.meta.glob(
    "/src/assets/**/*.{png,jpg,jpeg,svg,webp,gif,mp4,webm}",
    { eager: true },
  ) as Record<string, { default: string }>;

  if (imageModules[path]) {
    return imageModules[path].default;
  }

  throw new Error(`Image not found: ${path}`);
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
  southwestLng: number,
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

export const getCurrentTime = (addHour?: boolean): string => {
  const now = new Date();

  const timezoneOffset = now.getTimezoneOffset() * 60000;

  const localTime = new Date(now.getTime() - timezoneOffset);

  if (
    localTime.getMinutes() > 0 ||
    localTime.getSeconds() > 0 ||
    localTime.getMilliseconds() > 0
  ) {
    localTime.setHours(localTime.getHours() + 1);
  }

  localTime.setMinutes(0, 0, 0);

  if (addHour) {
    localTime.setHours(localTime.getHours() + 1);
  }

  return localTime.toISOString();
};

export const hourOptions: SelectOption[] = [
  { text: "1 hour", value: 1 },
  { text: "2 hours", value: 2 },
  { text: "3 hours", value: 3 },
  { text: "4 hours", value: 4 },
  { text: "5 hours", value: 5 },
  { text: "6 hours", value: 6 },
  { text: "7 hours", value: 7 },
  { text: "8 hours", value: 8 },
  { text: "9 hours", value: 9 },
  { text: "10 hours", value: 10 },
  { text: "11 hours", value: 11 },
  { text: "12 hours", value: 12 },
  { text: "13 hours", value: 13 },
  { text: "14 hours", value: 14 },
  { text: "15 hours", value: 15 },
  { text: "16 hours", value: 16 },
  { text: "17 hours", value: 17 },
  { text: "18 hours", value: 18 },
  { text: "19 hours", value: 19 },
  { text: "20 hours", value: 20 },
  { text: "21 hours", value: 21 },
  { text: "22 hours", value: 22 },
  { text: "23 hours", value: 23 },
  { text: "24 hours", value: 24 },
];
