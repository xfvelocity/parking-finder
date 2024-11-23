<template>
  <div class="map-container">
    <div ref="hereMap" class="map" tabindex="-1" />

    <MapSelected
      :selected-parking-uuid="selectedParkingUuid"
      @update:selectedParkingUuid="selectedParkingUuid = $event"
    />

    <MapList
      :model-value="!isLocationOpen"
      :items="items"
      @selected:item="selectedParkingUuid = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import type { MapPosition, SimpleParking } from "@/types/map.types";

import { ref, onMounted, watch, PropType } from "vue";
import { debounce, getImageUrl, calculateArea } from "@/composables/generic";
import { useMapStore } from "@/stores/map";
import { useUserStore } from "@/stores/user";
import { api } from "@/api/api";

import MapSelected from "@/components/map/MapSelected.vue";
import MapList from "@/components/map/MapList.vue";

// ** Props **
const props = defineProps({
  location: {
    type: Object as PropType<MapPosition>,
    default: () => ({}),
  },
  isLocationOpen: {
    type: Boolean,
    default: false,
  },
});

// ** Data **
const mapStore = useMapStore();
const userStore = useUserStore();

let map: google.maps.Map;
let mapController: AbortController = new AbortController();
const hereMap = ref<HTMLDivElement>();
const markers = ref<google.maps.marker.AdvancedMarkerElement[]>([]);
const selectedParkingUuid = ref<string>("");
const distanceMovedSinceUpdate = ref<number>(0);
const mapArea = ref<number>(0);
const searchZoom = ref<number>(15);
const items = ref<SimpleParking[]>([]);
const currentLocationMarker = ref<google.maps.marker.AdvancedMarkerElement>();

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
    selectedParkingUuid.value = "";
  });
};

const addMarker = (lat: number, lng: number, location: SimpleParking): void => {
  let content;

  if (mapStore.filters?.hours) {
    const priceValues = items.value.map(
      (item) => item.matchingPrice
    ) as number[];

    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    content = document.createElement("div");
    content.classList.add("map-item");

    if (location.matchingPrice === minPrice) {
      content.classList.add("border-green-darken-1", "text-green-darken-1");
    } else if (location.matchingPrice === maxPrice) {
      content.classList.add("border-red-darken-1", "text-red-darken-1");
    } else {
      content.classList.add("border-orange-darken-1", "text-orange-darken-1");
    }

    content.innerHTML = `£${location.matchingPrice?.toFixed(2)}` || "";
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
    selectedParkingUuid.value = location.uuid;
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

      mapStore.location.position = {
        lat: mapCoords.lat(),
        lng: mapCoords.lng(),
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

  const hours = mapStore.filters.hours;
  const params = `?lat=${mapStore.location.position.lat}&lng=${mapStore.location.position.lng}&radius=${mapArea.value}`;

  const res = await api(
    "GET",
    hours > 0 ? `map${params}&hours=${mapStore.filters.hours}` : `map${params}`
  );

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
    selectedParkingUuid.value = "";

    await refreshMarkers();

    if (userStore.currentLocation.name) {
      if (currentLocationMarker.value) {
        (currentLocationMarker.value as any).setMap(null);
        currentLocationMarker.value = undefined;
      }

      const content = document.createElement("div");
      content.className = "map-item-current";

      currentLocationMarker.value =
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
    selectedParkingUuid.value = "";

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
@use "sass:map";
@use "@/theme/variables/_colours";

.map {
  &-item {
    background: white;
    padding: 5px 15px;
    font-size: 10px;
    border-radius: 7px;
    border: 1px solid;

    &-current {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid white;
      background: map.get(colours.$colours, "blue-darken-1");
      box-shadow: 0 0 0 0 map.get(colours.$colours, "blue-darken-1");
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
