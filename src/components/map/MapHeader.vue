<template>
  <div class="map-header">
    <TextInput
      v-model="locationSearch"
      id="locationSearch"
      :prepend-icon="isLocationOpen ? 'chevron-left' : 'menu'"
      append-icon="clock"
      placeholder="Where do you want to park?"
      clear-button
      @focus="emits('toggle:modal', true)"
      @click:append="emits('toggle:time-select', true)"
      @click:prepend="
        isLocationOpen ? emits('toggle:modal', false) : openMenu()
      "
      @update:clear="clearInput"
      @update:modelValue="emits('location:search', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";

import TextInput from "@/components/basic/inputs/TextInput.vue";

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

const { location } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);
const timeSelectOpen = ref<boolean>(false);

// ** Methods **
const openMenu = (): void => {
  console.log("openmenu");
};

const clearInput = (): void => {
  location.value.name = "";
  emits("location:search", "");

  if (props.isLocationOpen) {
    const locationSearch = document.querySelector(
      "#locationSearch input"
    ) as HTMLInputElement;

    locationSearch?.focus();
  }
};

watch(location, () => {
  locationSearch.value = location.value.name;
});
</script>

<style lang="scss" scoped>
.map-header {
  padding: 10px 10px 5px 10px;
  display: flex;
  align-items: flex-end;

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
