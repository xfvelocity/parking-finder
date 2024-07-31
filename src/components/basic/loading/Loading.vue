<template>
  <div class="loading">
    <span class="text-center">
      <svg
        class="loading-icon"
        :class="`icon-stroke-${colour}`"
        :style="`width: ${size}px; height: ${size}px`"
        viewBox="0 0 50 50"
      >
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        />
      </svg>
    </span>
  </div>
</template>

<script lang="ts" setup>
// ** Props **
defineProps({
  size: {
    type: Number,
    default: 32,
  },
  colour: {
    type: String,
    default: "black",
  },
});
</script>

<style lang="scss" scoped>
.loading {
  &-icon {
    animation: rotate 2s linear infinite;
    z-index: 2;

    & .path {
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
