<template>
  <div v-show="isOpen" class="drag-modal" ref="dragModal">
    <IonHeader ref="dragModalHeader">
      <div class="drag-modal-icon mt-2" />

      <div v-if="$slots.header" class="drag-modal-header py-4">
        <slot name="header" />
      </div>
    </IonHeader>

    <IonContent>
      <slot />
    </IonContent>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import { ref, watchEffect, watch } from "vue";

import { IonContent, IonHeader } from "@ionic/vue";

// ** Props **
const props = defineProps({
  isOpen: {
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
});

// ** Emits **
const emits = defineEmits(["close", "breakpoint-updated"]);

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

    if (props.isOpen && dragModal.value) {
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
    false
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
    false
  );
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
    breakpointHeights.value.push(contentHeight * breakpoint)
  );

  const closestBreakpoint: number = breakpoint
    ? breakpoint * contentHeight
    : breakpointHeights.value.reduce((prev, curr) =>
        Math.abs(curr - newModalHeight.value) <
        Math.abs(prev - newModalHeight.value)
          ? curr
          : prev
      );

  if (closestBreakpoint === 0) {
    emits("close");
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
    false
  );
  dragModalHeader.value.$el.removeEventListener(
    "mousedown",
    handleMouseDown,
    false
  );
  dragModalHeader.value.$el.removeEventListener(
    "touchstart",
    handleMouseDown,
    false
  );
  dragModalHeader.value.$el.removeEventListener(
    "touchend",
    handleMouseUp,
    false
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
  }
);
</script>

<style scoped lang="scss">
.drag-modal {
  background: white;
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  &-header {
    border-bottom: 1px solid map-get($colours, "border");
  }

  &-icon {
    height: 5px;
    width: 36px;
    border-radius: 8px;
    background: map-get($colours, "grey-lighten-2");

    @include center(true, false);
  }
}
</style>
