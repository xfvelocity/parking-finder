<template>
  <div class="map-header">
    <Icon
      v-if="isLocationOpen"
      class="map-header-icon hover"
      src="chevron-left"
      fill="grey"
      @click="emits('toggle:modal', false)"
    />

    <TextInput
      v-model="locationSearch"
      label="Location"
      icon="search"
      placeholder="Search for a location"
      select-on-focus
      @focus="emits('toggle:modal', true)"
      @update:modelValue="onLocationSearch"
    />

    <Select
      :model-value="filters.hours"
      class="home-header-time"
      icon="time"
      :options="timeOptions"
      @update:modelValue="filters.hours = $event.value"
    />
  </div>
</template>

<script lang="ts" setup>
import type { MapLocation, MapLocationResult } from "@/types/map.types";

import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { searchLocation } from "@/composables/here";

import Icon from "@/components/basic/icon/Icon.vue";
import Select from "@/components/basic/inputs/Select.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";

// ** Props **
defineProps({
  isLocationOpen: {
    type: Boolean,
    default: false,
  },
});

// ** Emits **
const emits = defineEmits(["toggle:modal", "location:search"]);

// ** Data **
const mapStore = useMapStore();

const { location, filters } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);
const timeOptions = [
  { text: "Any", value: 0 },
  { text: "1 hour", value: 1 },
  { text: "2 hour", value: 2 },
  { text: "3 hour", value: 3 },
];

// ** Methods **
const onLocationSearch = async (value: string): Promise<void> => {
  const results = await searchLocation(value);

  emits("location:search", results);
};

watch(location, () => {
  locationSearch.value = location.value.name;
});
</script>

<style lang="scss" scoped>
.map-header {
  padding: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
  z-index: 10;

  &-icon {
    margin-right: 10px;
    margin-top: 2px;
  }

  .input {
    width: 100%;
    margin-right: 10px;
  }

  :deep(.select) {
    width: 100px;
  }
}
</style>
