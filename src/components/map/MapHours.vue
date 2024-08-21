<template>
  <div class="map-hours py-1 px-2">
    <div
      v-for="(hour, i) in hourOptions"
      :key="i"
      class="map-hours-item bg-white"
      :class="{
        'text-primary border-primary text-fw-600': selectedHour === hour.value,
      }"
      @click="
        $emit('selected:hour', selectedHour === hour.value ? 0 : hour.value)
      "
    >
      <Icon
        class="mr-1"
        src="clock"
        :fill="selectedHour === hour.value ? 'primary' : 'grey-darken-1'"
        :size="10"
      />

      <p>{{ hour.text }}</p>
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
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &-item {
    display: flex;
    align-items: center;
    padding: 6px 15px;
    border: 1px solid map-get($colours, "border");
    border-radius: 20px;
    white-space: nowrap;
    color: map-get($colours, "grey-darken-1");
    box-shadow:
      0 1px 2px rgba(60, 64, 67, 0.25),
      0 1px 3px 1px rgba(60, 64, 67, 0.1);

    p {
      font-size: 10px;
    }
  }
}
</style>
