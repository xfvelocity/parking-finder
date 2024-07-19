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

  console.log(filter);

  return (
    filter[0] === mapStore.filters.hours[0] &&
    filter[1] === mapStore.filters.hours[1]
  );
};
