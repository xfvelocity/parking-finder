<template>
  <inline-svg
    class="icon"
    :class="{ 'icon-colour': fill }"
    :src="getImageUrl(`icons/${src}.svg`)"
    :height="size"
    :width="size"
  />
</template>

<script lang="ts" setup>
import { getImageUrl } from "@/composables/generic";

import InlineSvg from "vue-inline-svg";

// ** Props **
defineProps({
  src: {
    type: String,
    default: "",
    required: true,
  },
  fill: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 12,
  },
});
</script>

<style lang="scss" scoped>
.icon-colour {
  :deep(path),
  :deep(rect) {
    fill: v-bind(fill) !important;
  }
}
</style>
