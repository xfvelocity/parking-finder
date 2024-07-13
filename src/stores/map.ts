import { defineStore } from "pinia";

export const useMapStore = defineStore("map", {
  state: () => ({
    location: {
      name: "London, UK",
      position: {
        lat: 51.5072,
        lng: -0.1276,
      },
    },
    persist: true,
  }),
});
