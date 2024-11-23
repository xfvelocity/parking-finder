<template>
  <PageLayout content-id="home">
    <div class="home">
      <LoadingBar v-if="loading" />

      <div class="home-header safe-area-top">
        <MapHeader
          :is-location-open="isLocationOpen"
          @toggle:modal="isLocationOpen = $event"
          @location:search="updateLocation"
          @set:location="selectLocation"
          @toggle:time-select="timeSelectOpen = true"
        />
      </div>

      <Map
        :is-location-open="isLocationOpen"
        :location="updatedLocation.position"
      />

      <TimePicker v-model="timeSelectOpen" @search="searchWithHours" />

      <div class="home-location">
        <Icon
          src="location-arrow"
          :size="14"
          :fill="usingCurrentLocation ? 'primary' : 'grey-darken-1'"
          @click="getCurrentLocation"
        />
      </div>

      <div v-if="isLocationOpen" class="home-header-results">
        <LoadingBar v-if="resultsLoading" />

        <div class="safe-area-top px-2 home-header-results-content">
          <p
            v-if="!mapResults.length && !resultsLoading"
            class="text-center pt-3 px-8"
          >
            {{
              searchTerm.length > 2
                ? "No locations found, please update your search and try again."
                : "Please enter more than 2 characters to begin your search"
            }}
          </p>

          <ul>
            <li
              v-for="(result, i) in mapResults"
              :key="i"
              class="hover"
              @click="selectLocation(result)"
            >
              <Icon class="mr-2" src="location-pin" fill="grey" :size="22" />

              <div>
                <h4>{{ result.title }}</h4>
                <p>{{ result.desc }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script lang="ts" setup>
import type { MapLocation, MapLocationResult } from "@/types/map.types";

import { ref } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { debounce } from "@/composables/generic";
import { searchLocation } from "@/composables/here";
import { Geolocation } from "@capacitor/geolocation";
import { useUserStore } from "@/stores/user";
import { searchName } from "@/composables/here";

import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";
import MapHeader from "@/components/map/MapHeader.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import LoadingBar from "@/components/basic/loading/LoadingBar.vue";
import TimePicker from "@/components/basic/time-picker/TimePicker.vue";

// ** Data **
const userStore = useUserStore();
const mapStore = useMapStore();

const { loading, usingCurrentLocation } = storeToRefs(mapStore);

const isLocationOpen = ref<boolean>(false);
const updatedLocation = ref<MapLocation>({ ...mapStore.location });
const mapResults = ref<MapLocationResult[]>([]);
const searchTerm = ref<string>("");
const resultsLoading = ref<boolean>(false);
const timeSelectOpen = ref<boolean>(false);

// ** Methods **
const getCurrentLocation = async () => {
  const coordinates = await Geolocation.getCurrentPosition();

  const { latitude, longitude } = coordinates.coords;
  const name = await searchName(latitude, longitude);

  userStore.currentLocation = {
    name,
    position: {
      lat: latitude,
      lng: longitude,
    },
  };

  if (!usingCurrentLocation.value) {
    selectLocation({
      title: name,
      position: {
        lat: latitude,
        lng: longitude,
      },
    });
  }
};

const searchWithHours = (hours: number): void => {
  mapStore.filters.hours = hours;
};

const updateLocation = debounce(async (term: string): Promise<void> => {
  searchTerm.value = term;

  if (term.length > 2) {
    resultsLoading.value = true;

    const results = await searchLocation(term);

    mapResults.value = results;
    resultsLoading.value = false;
  } else {
    mapResults.value = [];
  }
}, 500);

const selectLocation = (result: MapLocationResult): void => {
  mapStore.location = {
    name: result.title,
    position: result.position,
  };
  updatedLocation.value = {
    ...mapStore.location,
  };

  isLocationOpen.value = false;
};
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/theme/variables/_colours";
@use "@/theme/variables/_styles";

.home {
  position: relative;
  height: 100%;

  &-location {
    position: absolute;
    z-index: 2;
    background: white;
    border-radius: 100%;
    bottom: 100px;
    right: 10px;
    height: 40px;
    min-width: 40px;
    padding-right: 2px;
    border: 1px solid map.get(colours.$colours, "border");
    box-shadow: styles.$box-shadow;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-location-modal {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 54px);
    background: white;
    animation: extendHeight 0.5s forwards;
  }

  &-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 3;

    &-results {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: 2;
      background: white;

      &-content {
        margin-top: 60px;
      }

      ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          padding: 15px;
          display: flex;
          align-items: center;

          &:last-child {
            padding-bottom: 10px;
          }

          &:not(:last-child) {
            border-bottom: 1px solid map.get(colours.$colours, "border");
          }
        }
      }
    }
  }
}

@keyframes extendHeight {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}
</style>
