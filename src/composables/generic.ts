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
