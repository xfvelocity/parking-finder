<template>
  <div class="swipe-container">
    <div
      class="content"
      @touchstart="startTouch"
      @touchmove="moveTouch"
      @touchend="endTouch"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <slot />
    </div>

    <div class="delete-indicator">
      <Icon src="close" fill="white" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import Icon from "@/components/basic/icon/Icon.vue";

// ** Emits **
const emits = defineEmits(["delete"]);

// ** Data **
const startX = ref<number>(0);
const translateX = ref<number>(0);
const deleting = ref<boolean>(false);

// ** Methods **
const startTouch = (event: TouchEvent): void => {
  startX.value = event.touches[0].clientX;
};

const moveTouch = (event: TouchEvent): void => {
  const currentX = event.touches[0].clientX;
  translateX.value = currentX - startX.value;

  console.log(translateX.value);

  deleting.value = translateX.value < -100;
};

const endTouch = (): void => {
  if (deleting.value) {
    emits("delete");
    translateX.value = 0;
  } else {
    translateX.value = 0;
  }

  deleting.value = false;
};
</script>

<style lang="scss" scoped>
.swipe-container {
  transition: transform 0.3s ease;
  position: relative;
}

.content {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 2;
  background: white;
}

.delete-indicator {
  position: absolute;
  top: 1px;
  left: 10%;
  background-color: rgb(198, 0, 0);
  width: 89%;
  height: 90%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  p {
    color: white;
  }
}
</style>
