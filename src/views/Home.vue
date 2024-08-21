<template>
  <PageLayout>
    <div class="home">
      <LoadingBar v-if="loading" />

      <div class="home-header safe-area-top">
        <MapHeader
          :is-location-open="isLocationOpen"
          @toggle:modal="isLocationOpen = $event"
          @location:search="updateLocation"
          @set:location="selectLocation"
        />

        <MapHours
          v-if="!isLocationOpen"
          :selected-hour="filters.hours"
          @selected:hour="filters.hours = $event"
        />
      </div>

      <Map
        :is-location-open="isLocationOpen"
        :location="updatedLocation.position"
      />

      <div v-if="isLocationOpen" class="home-header-results">
        <LoadingBar v-if="resultsLoading" />

        <div class="p-2 safe-area-top mt-10">
          <p
            v-if="!mapResults.length && !resultsLoading"
            class="pt-3 text-center px-8"
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
                <h5>{{ result.title }}</h5>
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

import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";
import MapHeader from "@/components/map/MapHeader.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import MapHours from "@/components/map/MapHours.vue";
import LoadingBar from "@/components/basic/loading/LoadingBar.vue";

// ** Data **
const mapStore = useMapStore();

const { filters, loading } = storeToRefs(mapStore);

const isLocationOpen = ref<boolean>(false);
const updatedLocation = ref<MapLocation>({ ...mapStore.location });
const mapResults = ref<MapLocationResult[]>([]);
const searchTerm = ref<string>("");
const resultsLoading = ref<boolean>(false);

// ** Methods **
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
.home {
  position: relative;
  height: 100%;

  &-location-modal {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 54px);
    background-color: white;
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

      ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          font-size: 10px;
          color: rgb(100, 100, 100);
          padding: 15px;
          display: flex;
          align-items: center;

          h5 {
            font-size: 12px;
          }

          p {
            font-size: 10px;
          }

          &:last-child {
            padding-bottom: 10px;
          }

          &:not(:last-child) {
            border-bottom: 1px solid #e9eaf2;
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
