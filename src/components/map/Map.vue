<template>
  <div class="map-container">
    <div ref="hereMap" class="map" />
  </div>
</template>

<script lang="ts" setup>
import type { MapLocation } from "@/types/map.types";

import { ref, onMounted, watch, PropType } from "vue";
import { debounce } from "@/composables/generic";
import axios from "axios";

// ** Props **
const props = defineProps({
  location: {
    type: Object as PropType<MapLocation>,
    default: () => ({}),
  },
});

// ** Data **
const platform = ref<any>(null);
const hereMap = ref<HTMLDivElement>();
const map = ref<any>();

// ** Methods **
const initializeHereMap = async (): Promise<void> => {
  const H = (window as any).H;
  const maptypes = platform.value.createDefaultLayers();

  map.value = new H.Map(hereMap.value, maptypes.vector.normal.map, {
    zoom: 13,
    center: props.location,
  });

  addEventListener("resize", () => map.value.getViewPort().resize());

  new H.mapevents.Behavior(new H.mapevents.MapEvents(map.value));

  H.ui.UI.createDefault(map.value, maptypes);

  await getItems();

  map.value.addEventListener(
    "mapviewchange",
    debounce(async () => {
      await getItems();
    }, 300)
  );
};

const addMarker = (lat: number, lng: number, text: string): void => {
  const div = document.createElement("div");

  div.classList.add("map-item");
  div.innerHTML = text;

  const domIcon = new (window as any).H.map.DomIcon(div);

  const bearsMarker = new (window as any).H.map.DomMarker(
    { lat, lng },
    {
      icon: domIcon,
    }
  );

  map.value.addObject(bearsMarker);
};

const getItems = async (): Promise<void> => {
  setTimeout(async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/map?lat=${props.location.lat}&lng=${props.location.lng}`
    );

    res?.data?.forEach((d: any) => {
      addMarker(d.location.coordinates[1], d.location.coordinates[0], d.name);
    });
  }, 300);
};

// ** Lifecycle **
onMounted(() => {
  platform.value = new (window as any).H.service.Platform({
    apikey: import.meta.env.VITE_MAPS_API_KEY,
  });

  setTimeout(() => {
    initializeHereMap();
  }, 300);
});

// ** Watchers **
watch(
  () => props.location,
  async () => {
    map.value.setCenter(props.location);
    map.value.setZoom(13);
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
