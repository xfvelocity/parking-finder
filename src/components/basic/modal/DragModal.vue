<template>
  <div v-show="modelValue" class="drag-modal" ref="dragModal">
    <IonHeader ref="dragModalHeader">
      <div class="drag-modal-icon mt-2" />

      <div v-if="$slots.header" class="drag-modal-header text-center pt-5 pb-3">
        <slot name="header" />
      </div>
    </IonHeader>

    <IonContent>
      <slot />
    </IonContent>

    <IonFooter>
      <slot name="footer" />
    </IonFooter>
  </div>

  <div
    v-if="
      backdropBreakpoint?.toFixed(2) === currentBreakpoint.toFixed(2) &&
      modelValue
    "
    class="drag-modal-backdrop"
    @click="handleBackdropClick"
  />
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import { ref, watchEffect, watch } from "vue";

import { IonContent, IonHeader, IonFooter } from "@ionic/vue";

// ** Props **
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  breakpoints: {
    type: Array as PropType<number[]>,
    default: () => [0.1, 0.9],
  },
  initialBreakpoint: {
    type: Number,
    default: 0.1,
  },
  contentHeight: {
    type: Number,
    default: 0,
  },
  breakpoint: {
    type: Number,
    default: undefined,
  },
  fixedWhenFull: {
    type: Boolean,
    default: false,
  },
  backdropBreakpoint: {
    type: Number,
    default: undefined,
  },
  zIndex: {
    type: Number,
    default: 10,
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "breakpoint-updated"]);

// ** Data **
const position = ref<number>(0);
const dragModal = ref<any>();
const newModalHeight = ref<number>(200);
const currentBreakpoint = ref<number>(props.initialBreakpoint);
const breakpointHeights = ref<number[]>([]);
const dragModalHeader = ref<any>();

watchEffect(() => {
  setTimeout(() => {
    // Set initial breakpoint on open
    if (!props.breakpoint) {
      const contentHeight: number =
        props.contentHeight || window.innerHeight - 20;
      dragModal.value.style.height = `${contentHeight * props.initialBreakpoint}px`;
    }

    if (props.modelValue && dragModal.value) {
      addEventListeners();
    } else {
      removeEventListeners();
    }

    snapToBreakpoint();
  }, 100);
});

const handleMouseUp = (event: MouseEvent | TouchEvent): void => {
  snapToBreakpoint();
  document.removeEventListener(
    event?.type === "touchend" ? "touchmove" : "mousemove",
    resize,
    false,
  );
};

const handleMouseDown = (event: MouseEvent | TouchEvent): void => {
  position.value =
    event?.type == "mousedown"
      ? (event as MouseEvent).y
      : (
          (event as TouchEvent).touches[0] ||
          (event as TouchEvent).changedTouches[0]
        ).clientY;

  document.addEventListener(
    event?.type === "touchstart" ? "touchmove" : "mousemove",
    resize,
    false,
  );
};

const handleBackdropClick = (): void => {
  if (props.breakpoints.includes(0)) {
    emits("update:modelValue", false);
  } else {
    snapToBreakpoint(props.initialBreakpoint);
  }
};

const addEventListeners = (): void => {
  dragModalHeader.value.$el.addEventListener("mouseup", handleMouseUp);
  dragModalHeader.value.$el.addEventListener("mousedown", handleMouseDown);

  dragModalHeader.value.$el.addEventListener("touchstart", handleMouseDown);
  dragModalHeader.value.$el.addEventListener("touchend", handleMouseUp);
};

const snapToBreakpoint = (breakpoint?: number): void => {
  const contentHeight: number = props.contentHeight || window.innerHeight - 20;

  props.breakpoints.forEach((breakpoint) =>
    breakpointHeights.value.push(contentHeight * breakpoint),
  );

  const closestBreakpoint: number = breakpoint
    ? breakpoint * contentHeight
    : breakpointHeights.value.reduce((prev, curr) =>
        Math.abs(curr - newModalHeight.value) <
        Math.abs(prev - newModalHeight.value)
          ? curr
          : prev,
      );

  if (closestBreakpoint === 0) {
    emits("update:modelValue", false);
    removeEventListeners();

    return;
  }

  // Set new height and add transition
  dragModal.value.style.height = `${closestBreakpoint}px`;
  dragModal.value.style.transition = "height 0.2s ease-out";

  setTimeout(() => {
    if (dragModal.value?.style) {
      dragModal.value.style.transition = "";
    }
  }, 200);

  currentBreakpoint.value = closestBreakpoint / contentHeight;
  emits("breakpoint-updated", currentBreakpoint.value);

  // If max content is reached remove event listeners
  if (closestBreakpoint / contentHeight === 1 && props.fixedWhenFull) {
    dragModal.value.style.overflowY = "auto";
    removeEventListeners();
  } else {
    addEventListeners();
    dragModal.value.style.overflowY = "hidden";
  }
};

const removeEventListeners = (): void => {
  dragModalHeader.value.$el.removeEventListener(
    "mouseup",
    handleMouseUp,
    false,
  );
  dragModalHeader.value.$el.removeEventListener(
    "mousedown",
    handleMouseDown,
    false,
  );
  dragModalHeader.value.$el.removeEventListener(
    "touchstart",
    handleMouseDown,
    false,
  );
  dragModalHeader.value.$el.removeEventListener(
    "touchend",
    handleMouseUp,
    false,
  );

  document.removeEventListener("mousemove", resize, false);
  document.removeEventListener("touchmove", resize, false);
};

const resize = (event: MouseEvent | TouchEvent): void => {
  const y: number =
    event?.type === "mousemove"
      ? (event as MouseEvent).y
      : (
          (event as TouchEvent).touches[0] ||
          (event as TouchEvent).changedTouches[0]
        ).clientY;

  newModalHeight.value =
    parseInt(getComputedStyle(dragModal.value).height) + (position.value - y);

  // Don't allow to drag above the highest breakpoint
  if (
    currentBreakpoint.value ===
      props.breakpoints[props.breakpoints.length - 1] &&
    newModalHeight.value >=
      breakpointHeights.value[breakpointHeights.value.length - 1]
  ) {
    return;
  }

  position.value = y;
  dragModal.value.style.height = `${newModalHeight.value}px`;
};

// ** Watchers **
watch(
  () => props.breakpoint,
  (value) => {
    if (typeof value === "number" && value >= 0) {
      snapToBreakpoint(value);
    }
  },
);
</script>

<style scoped lang="scss">
@use "sass:map";
@use "@/theme/variables/_colours";
@use "@/theme/mixins";

.drag-modal {
  background: white;
  position: fixed;
  z-index: v-bind(zIndex);
  bottom: 0;
  left: 0;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0 4px 4px 4px rgba(0, 0, 0, 0.2);

  &-header {
    border-bottom: 1px solid map.get(colours.$colours, "border");
  }

  &-backdrop {
    position: fixed;
    background: rgba(0, 0, 0, 0.2);
    z-index: calc(v-bind(zIndex) - 1);
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  &-icon {
    height: 5px;
    width: 36px;
    border-radius: 8px;
    background: map.get(colours.$colours, "grey-lighten-2");

    @include mixins.center(true, false);
  }
}
</style>
