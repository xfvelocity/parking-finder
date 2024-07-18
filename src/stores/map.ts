import { MapStore } from "@/types/map.types";
import { defineStore } from "pinia";

export const useMapStore = defineStore("map", {
  state: (): MapStore => ({
    location: {
      name: "London, UK",
      position: {
        lat: 51.5072,
        lng: -0.1276,
      },
    },
    bounds: {
      left_corner_latitude: 0,
      left_corner_longitude: 0,
      right_corner_latitude: 0,
      right_corner_longitude: 0,
    },
    filters: {
      hours: [],
    },
    mapZoom: 13,
  }),
  persist: true,
});
