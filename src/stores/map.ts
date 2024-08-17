import { MapStore } from "@/types/map.types";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

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
      hours: 0,
    },
    mapZoom: 13,
    loading: false,
  }),
  getters: {
    usingCurrentLocation(): boolean {
      const userStore = useUserStore();

      return (
        userStore.currentLocation.position.lat === this.location.position.lat &&
        userStore.currentLocation.position.lng === this.location.position.lng
      );
    },
  },
  persist: true,
});
