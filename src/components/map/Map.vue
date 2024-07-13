<template>
  <div class="map-container">
    <div ref="hereMap" class="map" />
  </div>
</template>

<script lang="ts" setup>
import type { MapLocation } from "@/types/app.types";

import { ref, onMounted, watch, PropType } from "vue";

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
const initializeHereMap = (): void => {
  const H = (window as any).H;
  const maptypes = platform.value.createDefaultLayers();

  map.value = new H.Map(hereMap.value, maptypes.vector.normal.map, {
    zoom: 13,
    center: props.location,
  });

  addEventListener("resize", () => map.value.getViewPort().resize());

  new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  H.ui.UI.createDefault(map, maptypes);
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
  () => {
    map.value.setCenter(props.location);
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
