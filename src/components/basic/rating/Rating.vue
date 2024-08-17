<template>
  <div class="rating">
    <Icon
      v-for="star in fullStars"
      :key="star"
      src="star"
      fill="yellow-darken-4"
      :size="size"
    />
    <Icon v-if="halfStar" src="star-half" fill="yellow-darken-4" :size="size" />
    <Icon
      v-for="star in emptyStars"
      :key="star"
      src="star-empty"
      fill="yellow-darken-4"
      :size="size"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Icon from "@/components/basic/icon/Icon.vue";

// ** Props **
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    default: 12,
  },
});

// ** Computed **
const fullStars = computed<number>(() => {
  return Math.floor(props.rating);
});

const halfStar = computed<boolean>(() => {
  return props.rating % 1 >= 0.5;
});

const emptyStars = computed<number>(() => {
  return (
    5 - (halfStar.value ? Math.ceil(props.rating) : Math.floor(props.rating))
  );
});
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  width: max-content;
}
</style>
