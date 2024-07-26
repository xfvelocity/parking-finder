<template>
  <PageLayout>
    <template #header>
      <div class="home-header">
        <TextInput
          v-model="locationSearch"
          label="Location"
          icon="search"
          placeholder="Search for a location"
          select-on-focus
          @update:modelValue="onLocationSearch"
        />

        <Select
          v-model="filters.hours"
          class="home-header-time"
          icon="time"
          :options="timeOptions"
        />
      </div>
    </template>

    <Map :location="updatedLocation.position" />
  </PageLayout>
</template>

<script lang="ts" setup>
import { MapLocation, type MapLocationResult } from "@/types/map.types";

import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { searchLocation } from "@/composables/here";

import Select from "@/components/basic/inputs/Select.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";
import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";

// ** Data **
const mapStore = useMapStore();

const { location, filters } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);
const updatedLocation = ref<MapLocation>({ ...location.value });
const mapResults = ref<MapLocationResult[]>([]);
const timeOptions = [
  { text: "Any", value: 0 },
  { text: "1 hour", value: 1 },
  { text: "2 hour", value: 2 },
  { text: "3 hour", value: 3 },
];

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
  mapResults.value = [];
};

const onLocationSearch = async (value: string): Promise<void> => {
  mapResults.value = await searchLocation(value);
};

// const isFiltersMatching = (filter: number[]): boolean => {
//   return (
//     filter[0] === filters.value.hours[0] && filter[1] === filters.value.hours[1]
//   );
// };

watch(location, () => {
  locationSearch.value = location.value.name;
});
</script>

<style lang="scss" scoped>
.home {
  &-header {
    padding: 10px;
    display: flex;
    align-items: center;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
    z-index: 10;

    .input {
      width: 100%;
      margin-right: 10px;
    }

    :deep(.select) {
      width: 100px;
    }

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

    &-results {
      width: 100%;
      border-radius: 5px;
      padding: 7px 10px;
      border: 1px solid rgb(230, 230, 230);
      margin-top: 5px;

      ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          font-size: 12px;
          color: rgb(100, 100, 100);
          padding: 10px 0;

          &:last-child {
            padding-bottom: 10px;
          }

          &:not(:last-child) {
            border-bottom: 1px solid rgb(230, 230, 230);
          }
        }
      }
    }
  }
}
</style>
