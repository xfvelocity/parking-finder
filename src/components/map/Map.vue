<template>
  <div class="map-container">
    <div ref="hereMap" class="map" />
  </div>
</template>

<script lang="ts" setup>
import type { MapPosition } from "@/types/map.types";

import { ref, onMounted, watch, PropType } from "vue";
import {
  debounce,
  getImageUrl,
  isFiltersMatching,
} from "@/composables/generic";
import { useMapStore } from "@/stores/map";
import axios from "axios";
import { searchName } from "@/composables/here";

// ** Props **
const props = defineProps({
  location: {
    type: Object as PropType<MapPosition>,
    default: () => ({}),
  },
});

// ** Data **
const mapStore = useMapStore();

let map: google.maps.Map;
let mapController: AbortController = new AbortController();
const hereMap = ref<HTMLDivElement>();
const markers = ref<any[]>([]);

// ** Methods **
const initMap = async (): Promise<void> => {
  map = new google.maps.Map(hereMap.value as HTMLElement, {
    center: props.location,
    zoom: mapStore.mapZoom,
    maxZoom: 17,
    minZoom: 13,
    clickableIcons: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
  });

  await getItems();

  map.addListener(
    "idle",
    debounce(async () => {
      await mapMoved();
    }, 500)
  );
};

const addMarker = (lat: number, lng: number, prices: any): void => {
  let content;

  if (mapStore.filters?.hours?.length) {
    content = document.createElement("div");
    content.classList.add("map-item");

    const text = prices.map((price: any) => {
      if (isFiltersMatching(price.hours)) {
        return price.price;
      }
    });

    content.innerHTML = `£${text}` || "";
  } else {
    content = document.createElement("img");
    const src = getImageUrl("icons/parking.svg");
    content.src = src;
  }

  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { lat, lng },
    content,
  });

  markers.value.push(marker);
};

const mapMoved = async (): Promise<void> => {
  const bounds: google.maps.LatLngBounds | undefined = map?.getBounds();
  const mapCoords = map.getCenter();

  if (bounds && mapCoords) {
    const newLat = mapCoords.lat();
    const newLng = mapCoords.lng();

    const thresholdExceeded: boolean = distanceExceedsThreshold(
      mapStore.location.position,
      {
        lat: newLat,
        lng: newLng,
      }
    );

    mapStore.bounds = {
      left_corner_latitude: bounds.getNorthEast().lat(),
      left_corner_longitude: bounds.getSouthWest().lng(),
      right_corner_latitude: bounds.getSouthWest().lat(),
      right_corner_longitude: bounds.getNorthEast().lng(),
    };

    mapStore.mapZoom = map.getZoom() || 13;

    if (thresholdExceeded) {
      mapStore.location = {
        name: await searchName(mapCoords.lat(), mapCoords.lng()),
        position: {
          lat: mapCoords.lat(),
          lng: mapCoords.lng(),
        },
      };

      await refreshMarkers();
    }
  }
};

const refreshMarkers = async (): Promise<void> => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  await getItems();
};

const getItems = async (): Promise<void> => {
  mapController.abort();
  mapController = new AbortController();

  let res;
  const hours = mapStore.filters.hours;

  if (hours.length) {
    res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/map?lat=${props.location.lat}&lng=${props.location.lng}&hours[0]=${hours[0]}&hours[1]=${hours[1]}`
    );
  } else {
    res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/map?lat=${props.location.lat}&lng=${props.location.lng}`
    );
  }

  res?.data?.forEach((d: any) => {
    addMarker(d.location.coordinates[1], d.location.coordinates[0], d.prices);
  });
};

const distanceExceedsThreshold = (
  from: MapPosition,
  to: MapPosition
): boolean => {
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    from,
    to
  );

  const thresholds: Record<number, number> = {
    13: 1000,
    14: 750,
    16: 500,
    17: 250,
  };

  return distance > thresholds[mapStore.mapZoom];
};

// ** Lifecycle **
onMounted(initMap);

// ** Watchers **
watch(
  () => props.location,
  async () => {
    map.setCenter(props.location);
    map.setZoom(13);
  }
);

watch(
  () => mapStore.filters.hours,
  async () => {
    await refreshMarkers();
  }
);
</script>

<style lang="scss" scoped>
.map,
.map-container {
  height: 100%;
  width: 100%;
}
</style>

<style lang="scss">
.map-item {
  background: white;
  padding: 3px 15px;
  font-size: 10px;
  border-radius: 20px;
  border: 2px solid $cheap;
  color: $cheap;
  font-weight: 600;
}
</style>
