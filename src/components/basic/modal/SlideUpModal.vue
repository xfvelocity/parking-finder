<template>
  <div
    v-if="isOpen"
    class="slide-up-modal"
    :class="{
      'slide-up-modal-full': height === '100%',
      'slide-up-modal-lower': !modelValue,
    }"
  >
    <template v-if="modelValue">
      <slot />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

// ** Props **
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: "100px",
  },
});

// ** Data **
const isOpen = ref<boolean>(props.modelValue);

// ** Emits **
defineEmits(["update:modelValue"]);

// ** Watchers **
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      isOpen.value = true;
    } else {
      setTimeout(() => {
        isOpen.value = false;
      }, 500);
    }
  }
);
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

  &-full {
    border-radius: 0 !important;
  }

  &-lower {
    animation: lowerHeight 0.5s forwards;
  }
}

@keyframes extendHeight {
  from {
    height: 0;
  }
  to {
    height: v-bind(height);
  }
}

@keyframes lowerHeight {
  from {
    height: v-bind(height);
  }
  to {
    height: 0;
  }
}
</style>
