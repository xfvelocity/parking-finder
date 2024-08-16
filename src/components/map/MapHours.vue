<template>
  <div class="map-hours py-1 px-1">
    <div
      v-for="(hour, i) in hourOptions"
      :key="i"
      class="map-hours-item"
      :class="{ 'bg-white text-primary': selectedHour === hour.value }"
      @click="
        $emit('selected:hour', selectedHour === hour.value ? 0 : hour.value)
      "
    >
      <Icon
        class="mr-1"
        src="time"
        :fill="selectedHour === hour.value ? 'primary' : 'grey'"
        :size="10"
      />

      {{ hour.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { hourOptions } from "@/composables/generic";

import Icon from "../basic/icon/Icon.vue";

// ** Props **
defineProps({
  selectedHour: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
.map-hours {
  position: absolute;
  z-index: 1;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &-item {
    display: flex;
    align-items: center;
    padding: 5px 15px;
    background: map-get($colours, "background");
    border: 1px solid map-get($colours, "border");
    color: rgb(140, 140, 140);
    border-radius: 7px;
    font-size: 10px;
    white-space: nowrap;
  }
}
</style>
