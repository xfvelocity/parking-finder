<template>
  <div class="map-container">
    <div ref="hereMap" class="map" />
  </div>
</template>

<script lang="ts" setup>
import type { MapLocation } from "@/types/map.types";

import { ref, onMounted, watch, PropType } from "vue";
import { debounce, getImageUrl } from "@/composables/generic";
import { useMapStore } from "@/stores/map";
import axios from "axios";

// ** Props **
const props = defineProps({
  location: {
    type: Object as PropType<MapLocation>,
    default: () => ({}),
  },
});

// ** Data **
const mapStore = useMapStore();

let map: google.maps.Map;
const hereMap = ref<HTMLDivElement>();

// ** Methods **
const initMap = async (): Promise<void> => {
  map = new google.maps.Map(hereMap.value as HTMLElement, {
    center: props.location,
    zoom: 13,
    maxZoom: 17,
    minZoom: 13,
    clickableIcons: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    styles: [{ stylers: [{}] }],
  });

  map.addListener(
    "idle",
    debounce(async () => {
      await getItems();
    }, 300)
  );

  await getItems();
};

const addMarker = (lat: number, lng: number, text: string): void => {
  let content;

  if (mapStore.filters?.hours?.length) {
    content = document.createElement("div");
    content.classList.add("map-item");
    content.innerHTML = text;
  } else {
    content = document.createElement("img");
    const src = getImageUrl("icons/parking.svg");
    content.src = src;
  }

  new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { lat, lng },
    content,
  });
};

const getItems = async (): Promise<void> => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/map?lat=${props.location.lat}&lng=${props.location.lng}`
  );

  res?.data?.forEach((d: any) => {
    addMarker(d.location.coordinates[1], d.location.coordinates[0], d.name);
  });
};

// ** Lifecycle **
onMounted(initMap);

// ** Watchers **
watch(
  () => props.location,
  async () => {
    map.setCenter(props.location);
    map.setZoom(14);
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
  padding: 5px;
  font-size: 10px;
  border-radius: 5px;
}
</style>
