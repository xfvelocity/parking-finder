<template>
  <div class="map-container">
    <div ref="hereMap" class="map" />

    <MapSelected
      :selected-parking="selectedParking"
      @update:selectedParking="selectedParking = $event"
    />

    <MapList
      :model-value="true"
      :items="items"
      @selected:item="selectedParking = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import type { MapPosition, Parking } from "@/types/map.types";

import { ref, onMounted, watch, PropType } from "vue";
import { debounce, getImageUrl, calculateArea } from "@/composables/generic";
import { useMapStore } from "@/stores/map";
import { searchName } from "@/composables/here";
import axios from "axios";

import MapSelected from "@/components/map/MapSelected.vue";
import MapList from "@/components/map/MapList.vue";
import { useUserStore } from "@/stores/user";

// ** Props **
const props = defineProps({
  location: {
    type: Object as PropType<MapPosition>,
    default: () => ({}),
  },
});

// ** Data **
const mapStore = useMapStore();
const userStore = useUserStore();

let map: google.maps.Map;
let mapController: AbortController = new AbortController();
const hereMap = ref<HTMLDivElement>();
const markers = ref<google.maps.marker.AdvancedMarkerElement[]>([]);
const selectedParking = ref<Parking | null>(null);
const distanceMovedSinceUpdate = ref<number>(0);
const mapArea = ref<number>(0);
const searchZoom = ref<number>(15);
const items = ref<Parking[]>([]);

// ** Methods **
const initMap = async (): Promise<void> => {
  map = new google.maps.Map(hereMap.value as HTMLElement, {
    center: props.location,
    zoom: mapStore.mapZoom,
    maxZoom: 17,
    minZoom: 15,
    clickableIcons: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
  });

  setTimeout(async () => {
    await mapMoved(true);
  }, 200);

  map.addListener(
    "idle",
    debounce(async () => {
      await mapMoved();
    }, 500)
  );

  map.addListener(
    "zoom_changed",
    debounce(async () => {
      const currentZoom = map.getZoom() || 17;

      if (searchZoom.value > currentZoom) {
        await refreshMarkers();
      }
    }, 500)
  );

  map.addListener("click", () => {
    selectedParking.value = null;
  });
};

const addMarker = (lat: number, lng: number, location: Parking): void => {
  let content;

  if (mapStore.filters?.hours) {
    content = document.createElement("div");
    content.classList.add("map-item");

    const sortedArray = location.prices.sort((a, b) => a.hours - b.hours);
    const text = sortedArray.filter((x) => x.hours >= mapStore.filters.hours)[0]
      .price;

    content.innerHTML = `£${text.toFixed(2)}` || "";
  } else {
    content = document.createElement("img");
    content.classList.add("map-icon");
    let src;

    if (location.type === "ncp") {
      src = getImageUrl("icons/ncp.svg");
    } else {
      src = getImageUrl("icons/parking.svg");
    }

    content.src = src;
  }

  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { lat, lng },
    content,
  });

  marker.addListener("click", () => {
    selectedParking.value = location;
  });

  markers.value.push(marker);
};

const mapMoved = async (firstLoad: boolean = false): Promise<void> => {
  const bounds: google.maps.LatLngBounds | undefined = map?.getBounds();
  const mapCoords = map.getCenter();

  if (bounds && mapCoords) {
    const thresholdExceeded: boolean = distanceExceedsThreshold(
      mapStore.location.position,
      {
        lat: mapCoords.lat(),
        lng: mapCoords.lng(),
      }
    );

    mapStore.mapZoom = map.getZoom() || 13;

    if (thresholdExceeded || firstLoad) {
      mapArea.value = calculateArea(
        bounds.getNorthEast().lat(),
        bounds.getNorthEast().lng(),
        bounds.getSouthWest().lat(),
        bounds.getSouthWest().lng()
      );

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
  mapStore.loading = true;

  markers.value.forEach((marker) => (marker as any).setMap(null));
  markers.value = [];

  await getItems();

  mapStore.loading = false;
};

const getItems = async (): Promise<void> => {
  mapController.abort();
  mapController = new AbortController();

  let res;
  const hours = mapStore.filters.hours;

  if (hours > 0) {
    res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/map?lat=${mapStore.location.position.lat}&lng=${mapStore.location.position.lng}&hours=${mapStore.filters.hours}`
    );
  } else {
    res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/map?lat=${mapStore.location.position.lat}&lng=${mapStore.location.position.lng}&radius=${mapArea.value}`
    );
  }

  searchZoom.value = map.getZoom() || 15;

  items.value = res?.data;

  res?.data?.forEach((d: any) => {
    addMarker(d.location.coordinates[1], d.location.coordinates[0], d);
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

  distanceMovedSinceUpdate.value += distance;

  const thresholds: Record<number, number> = {
    15: 750,
    16: 500,
    17: 250,
  };

  if (distanceMovedSinceUpdate.value > thresholds[mapStore.mapZoom]) {
    distanceMovedSinceUpdate.value = 0;
    return true;
  } else {
    return false;
  }
};

// ** Lifecycle **
onMounted(initMap);

// ** Watchers **
watch(
  () => props.location,
  async () => {
    map.setCenter(props.location);
    map.setZoom(15);
    selectedParking.value = null;

    await refreshMarkers();

    if (userStore.currentLocation.name) {
      const content = document.createElement("div");
      content.className = "map-item-current";

      new google.maps.marker.AdvancedMarkerElement({
        title: "Current location",
        content: content,
        map: map,
        position: {
          ...userStore.currentLocation.position,
        },
      });
    }
  }
);

watch(
  () => mapStore.filters.hours,
  async () => {
    selectedParking.value = null;

    await refreshMarkers();
  }
);
</script>

<style lang="scss" scoped>
.map,
.map-container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>

<style lang="scss">
.map {
  &-item {
    background: white;
    padding: 5px 15px;
    font-size: 10px;
    border-radius: 10px;
    border: 2px solid map-get($colours, "border");
    color: map-get($colours, "black");
    font-weight: 600;

    &-current {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid white;
      background-color: map-get($colours, "blue-darken-1");
      box-shadow: 0 0 0 0 map-get($colours, "blue-darken-1");
      transform: scale(1);
      animation: pulse 3s infinite;
    }
  }

  &-icon {
    height: 28px;
    width: 28px;
    border-radius: 4px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(25, 105, 255, 0.6);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(25, 105, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(25, 105, 255, 0);
  }
}
</style>
