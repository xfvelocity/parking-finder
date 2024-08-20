<template>
  <div class="map-header">
    <Icon
      v-if="isLocationOpen"
      class="map-header-icon hover mb-2"
      src="chevron-left"
      fill="grey"
      :size="14"
      @click="emits('toggle:modal', false)"
    />

    <TextInput
      v-model="locationSearch"
      id="locationSearch"
      prepend-icon="search"
      placeholder="Search for a location"
      select-on-focus
      close-button
      @focus="emits('toggle:modal', true)"
      @update:clear="clearInput"
      @update:modelValue="onLocationSearch"
    />

    <div class="map-header-location">
      <Icon
        src="location-arrow"
        :size="14"
        :fill="usingCurrentLocation ? 'primary' : 'grey-darken-1'"
        @click="getCurrentLocation"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { searchLocation, searchName } from "@/composables/here";
import { debounce } from "@/composables/generic";
import { Geolocation } from "@capacitor/geolocation";
import { useUserStore } from "@/stores/user";

import Icon from "@/components/basic/icon/Icon.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";

// ** Props **
defineProps({
  isLocationOpen: {
    type: Boolean,
    default: false,
  },
});

// ** Emits **
const emits = defineEmits(["toggle:modal", "location:search", "set:location"]);

// ** Data **
const mapStore = useMapStore();
const userStore = useUserStore();

const { location, usingCurrentLocation } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);

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
    emits("set:location", {
      title: name,
      position: {
        lat: latitude,
        lng: longitude,
      },
    });
  }
};

const clearInput = (): void => {
  emits("toggle:modal", true);

  const locationSearch = document.querySelector(
    "#locationSearch input"
  ) as HTMLInputElement;

  locationSearch?.focus();
};

const onLocationSearch = debounce(async (value: string): Promise<void> => {
  const results = await searchLocation(value);

  emits("location:search", results);
}, 500);

watch(location, () => {
  locationSearch.value = location.value.name;
});
</script>

<style lang="scss" scoped>
.map-header {
  padding: 10px 10px 5px 10px;
  display: flex;
  align-items: flex-end;

  &-location {
    background: white;
    border-radius: 10px;
    height: 40px;
    min-width: 40px;
    padding-right: 1px;
    border: 1px solid map-get($colours, "border");
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      0 -1px 0px rgba(0, 0, 0, 0.02);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-icon {
    margin-right: 10px;
    margin-top: 2px;
  }

  .input {
    width: 100%;
    margin-right: 10px;
    height: 40px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 -1px 0px rgba(0, 0, 0, 0.01);
  }
}
</style>
