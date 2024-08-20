<template>
  <div
    class="loading-bar"
    :class="`bg-${backgroundColour}`"
    :style="`height: ${height}px`"
  >
    <div class="loading-bar-progress" :class="`bg-${progressColour}`" />
  </div>
</template>

<script lang="ts" setup>
// ** Props **
defineProps({
  backgroundColour: {
    type: String,
    default: "grey-lighten-3",
  },
  height: {
    type: Number,
    default: 3,
  },
  progressColour: {
    type: String,
    default: "primary",
  },
});
</script>

<style lang="scss" scoped>
.loading-bar {
  width: 100%;

  &-progress {
    height: 100%;
    width: 0;
    animation: loading-bar-progress 1.5s linear infinite;
  }
}

@keyframes loading-bar-progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
