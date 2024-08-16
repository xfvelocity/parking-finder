<template>
  <div class="map-header bg-background safe-area-top">
    <div class="map-header-content">
      <Icon
        v-if="isLocationOpen"
        class="map-header-icon hover"
        src="chevron-left"
        fill="grey"
        :size="14"
        @click="emits('toggle:modal', false)"
      />

      <TextInput
        v-model="locationSearch"
        id="locationSearch"
        label="Location"
        icon="search"
        placeholder="Search for a location"
        select-on-focus
        @focus="emits('toggle:modal', true)"
        @update:clear="clearInput"
        @update:modelValue="onLocationSearch"
      />
    </div>

    <LoadingBar v-if="loading" />
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from "@/types/app.types";

import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { searchLocation } from "@/composables/here";
import { debounce, hourOptions } from "@/composables/generic";

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
const emits = defineEmits(["toggle:modal", "location:search"]);

// ** Data **
const mapStore = useMapStore();

const { location, loading } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);

// ** Methods **
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
    align-items: center;
  }

  &-icon {
    margin-right: 10px;
    margin-top: 2px;
  }

  .input {
    width: 100%;
    margin-right: 10px;
  }

  :deep(.select) {
    width: 160px;
  }
}
</style>
