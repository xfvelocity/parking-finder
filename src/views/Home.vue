<template>
  <PageLayout>
    <template #header>
      <IonHeader>
        <IonToolbar>
          <div class="home-header">
            <Select
              v-model="locationSearch"
              label="Location"
              placeholder="Search for a location"
              :outside-request="onLocationSearch"
              autocomplete
              @update:modelValue="selectLocation"
            />

            <div class="home-header-filters">
              <div
                v-for="(filter, i) in filtersList"
                :key="i"
                class="home-header-filter hover"
                :class="{
                  'home-header-filter-selected': isFiltersMatching(filter),
                }"
                @click="selectFilter(filter)"
              >
                {{ formatFilterText(filter) }}
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
    </template>

    <Map :location="updatedLocation.position" />
  </PageLayout>
</template>

<script lang="ts" setup>
import { MapLocation, type MapLocationResult } from "@/types/map.types";

import { IonHeader, IonToolbar } from "@ionic/vue";
import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { searchLocation } from "@/composables/here";

import Select from "@/components/basic/inputs/Select.vue";
import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";

// ** Data **
const mapStore = useMapStore();

const { location, filters } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);
const filtersList = [[0, 1], [1, 2], [2, 3], [3, 4], [5]];
const updatedLocation = ref<MapLocation>({ ...location.value });

// ** Methods **
const selectLocation = (result: MapLocationResult): void => {
  location.value = {
    name: result.text.split(",")[0],
    position: result.value,
  };
  updatedLocation.value = {
    ...location.value,
  };

  locationSearch.value = location.value.name;
};

const onLocationSearch = async (value: string): Promise<void> => {
  return await searchLocation(value);
};

const formatFilterText = (filter: number[]): any => {
  if (filter.length === 1) {
    return `${filter[0]}+ hours`;
  } else {
    if (filter[1] === 1) {
      return `${filter[1]} hour`;
    } else {
      return `${filter[1]} hours`;
    }
  }
};

const selectFilter = (filter: number[]): void => {
  if (isFiltersMatching(filter)) {
    filters.value.hours = [];
  } else {
    filters.value.hours = filter;
  }
};

const isFiltersMatching = (filter: number[]): boolean => {
  return (
    filter[0] === filters.value.hours[0] && filter[1] === filters.value.hours[1]
  );
};

watch(location, () => {
  console.log("firing");
  locationSearch.value = location.value.name;
});
</script>

<style lang="scss" scoped>
.home {
  &-header {
    padding: 15px;

    &-filters {
      display: flex;
      gap: 5px;
      margin-top: 5px;
    }

    &-filter {
      font-size: 10px;
      border-radius: 7px;
      border: 1px solid $border;
      padding: 5px 10px;

      &-selected {
        border: 1px solid black;
      }
    }
  }
}
</style>
