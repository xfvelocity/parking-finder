<template>
  <div class="map-container">
    <div ref="hereMap" class="map" />

    <div v-if="selectedParking" class="map-selected">
      <h5>{{ selectedParking.name }}</h5>

      <div>
        <p>Prices</p>
        <ul>
          <li v-for="(price, i) in selectedParking.prices">
            <div>
              {{ formatFilterText(price.hours) }}
            </div>

            <div>£{{ price.price.toFixed(2) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MapPosition } from "@/types/map.types";

import { ref, onMounted, watch, PropType } from "vue";
import {
  debounce,
  getImageUrl,
  isFiltersMatching,
  formatFilterText,
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
const selectedParking = ref<any>();

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

  map.addListener("click", () => {
    selectedParking.value = null;
  });
};

const addMarker = (lat: number, lng: number, location: any): void => {
  let content;

  if (mapStore.filters?.hours?.length) {
    content = document.createElement("div");
    content.classList.add("map-item");

    const text = location.prices
      .map((price: any) => {
        if (isFiltersMatching(price.hours)) {
          return price.price;
        }
      })
      .filter((item: any) => item)[0];

    content.innerHTML = `£${text.toFixed(2)}` || "";
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

  marker.addListener("click", () => {
    selectedParking.value = location;
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
  position: relative;
}
</style>

<style lang="scss">
.map {
  &-item {
    background: white;
    padding: 3px 15px;
    font-size: 10px;
    border-radius: 20px;
    border: 2px solid $cheap;
    color: $cheap;
    font-weight: 600;
  }

  &-selected {
    bottom: 30px;
    background: white;
    padding: 10px;
    width: 90%;
    border-radius: 10px;
    @include center(true, false);

    h5 {
      font-size: 10px;
    }

    p {
      margin-top: 5px;
      font-size: 10px;
      font-weight: 500;
    }

    &-price {
      margin-left: auto;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 10px;
      }
    }
  }
}
</style>
