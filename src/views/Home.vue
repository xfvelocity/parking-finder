<template>
  <PageLayout>
    <template #header>
      <MapHeader
        :is-location-open="isLocationOpen"
        @toggle:modal="isLocationOpen = $event"
        @location:search="updateLocation"
        @set:location="selectLocation"
      />
    </template>

    <div class="home">
      <MapHours
        :selected-hour="filters.hours"
        @selected:hour="filters.hours = $event"
      />

      <Map :location="updatedLocation.position" />

      <SlideUpModal v-model="isLocationOpen" height="100%">
        <div class="home-header-results">
          <ul>
            <li
              v-for="(result, i) in mapResults"
              :key="i"
              class="hover"
              @click="selectLocation(result)"
            >
              <Icon class="mr-1" src="location-pin" :size="18" />

              <div>
                <h5>{{ result.title }}</h5>
                <p>{{ result.desc }}</p>
              </div>
            </li>
          </ul>
        </div>
      </SlideUpModal>
    </div>
  </PageLayout>
</template>

<script lang="ts" setup>
import type { MapLocation, MapLocationResult } from "@/types/map.types";

import { ref } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";

import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";
import MapHeader from "@/components/map/MapHeader.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import MapHours from "@/components/map/MapHours.vue";
import SlideUpModal from "@/components/basic/modal/SlideUpModal.vue";

// ** Data **
const mapStore = useMapStore();

const { filters } = storeToRefs(mapStore);

const isLocationOpen = ref<boolean>(false);
const updatedLocation = ref<MapLocation>({ ...mapStore.location });
const mapResults = ref<MapLocationResult[]>([]);

// ** Methods **
const updateLocation = (results: MapLocationResult[]): void => {
  mapResults.value = results;
};

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
    &-results {
      width: 100%;
      margin-top: 5px;

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

          h5,
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
