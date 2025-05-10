<template>
  <div class="map-header">
    <TextInput
      v-model="locationSearch"
      id="locationSearch"
      :prepend-icon="isLocationOpen ? 'chevron-left' : 'menu'"
      :prepend-icon-size="16"
      placeholder="Where do you want to park?"
      clear-button
      @focus="emits('toggle:modal', true)"
      @click:prepend="
        isLocationOpen ? emits('toggle:modal', false) : openMenu()
      "
      @update:clear="clearInput"
      @update:modelValue="emits('location:search', $event)"
    />

    <div v-if="!isLocationOpen" class="map-header-time">
      <Icon
        src="clock"
        :size="14"
        :fill="usingFilter ? 'primary' : 'grey-darken-1'"
        @click="emits('toggle:time-select', true)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { menuController } from "@ionic/vue";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import Icon from "@/components/basic/icon/Icon.vue";

// ** Props **
const props = defineProps({
  isLocationOpen: {
    type: Boolean,
    default: false,
  },
});

// ** Emits **
const emits = defineEmits([
  "toggle:modal",
  "location:search",
  "set:location",
  "toggle:time-select",
]);

// ** Data **
const mapStore = useMapStore();

const { location, usingFilter } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);

// ** Methods **
const openMenu = async (): Promise<void> => {
  await menuController.open("sideMenu");
};

const clearInput = (): void => {
  location.value.name = "";
  emits("location:search", "");

  if (props.isLocationOpen) {
    const locationSearch = document.querySelector(
      "#locationSearch input",
    ) as HTMLInputElement;

    locationSearch?.focus();
  }
};

watch(location, () => {
  locationSearch.value = location.value.name;
});
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/theme/variables/_colours";
@use "@/theme/variables/_styles";

.map-header {
  padding: 20px;
  display: flex;
  align-items: flex-end;

  &-icon {
    margin-right: 10px;
    margin-top: 2px;
  }

  &-time {
    background: white;
    border-radius: 10px;
    height: 40px;
    min-width: 40px;
    padding-right: 1px;
    border: 1px solid map.get(colours.$colours, "border");
    box-shadow: styles.$box-shadow;

    display: flex;
    align-items: center;
    justify-content: center;
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
