<template>
  <div class="map-header bg-background safe-area-top">
    <div class="map-header-content">
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
        label="Location"
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
          :size="12"
          :fill="usingCurrentLocation ? 'primary' : 'grey-darken-1'"
          @click="getCurrentLocation"
        />
      </div>
    </div>

    <LoadingBar v-if="loading" />
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
import LoadingBar from "@/components/basic/loading/LoadingBar.vue";

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

const { location, loading, usingCurrentLocation } = storeToRefs(mapStore);

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
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
  z-index: 10;

  &-content {
    padding: 15px;
    display: flex;
    align-items: flex-end;
  }

  &-location {
    background: white;
    border-radius: 10px;
    height: 35px;
    min-width: 35px;
    padding-right: 1px;
    border: 1px solid map-get($colours, "border");

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
    margin-right: 5px;
  }
}
</style>
