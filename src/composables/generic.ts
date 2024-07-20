import { useMapStore } from "@/stores/map";

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

export const isFiltersMatching = (filter: number[]): boolean => {
  const mapStore = useMapStore();

  return (
    filter[0] === mapStore.filters.hours[0] &&
    filter[1] === mapStore.filters.hours[1]
  );
};

export const formatFilterText = (filter: number[]): any => {
  if (filter.length === 1) {
    return `${filter[0]}+ hours`;
  } else {
    if (filter[1] === 1) {
      return `${filter[1]} hour`;
    } else {
      return `${filter[1]} hours`;
    }
  }
};
