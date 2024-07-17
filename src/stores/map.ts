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
    filters: {
      hours: [],
    },
  }),
  persist: true,
});
