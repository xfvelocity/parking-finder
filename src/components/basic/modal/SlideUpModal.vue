<template>
  <div v-if="modelValue" class="slide-up-modal">
    <slot />
  </div>
</template>

<script lang="ts" setup>
// ** Props **
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: "100px",
  },
});

// ** Emits **
defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.slide-up-modal {
  position: absolute;
  left: 0;
  bottom: 0;
  height: v-bind(height);
  width: 100%;
  background-color: white;
  animation: extendHeight 0.5s forwards;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

@keyframes extendHeight {
  from {
    height: 0;
  }
  to {
    height: v-bind(height);
  }
}
</style>
