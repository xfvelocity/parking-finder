<template>
  <button class="button hover" :class="`bg-${background}`">
    <Icon v-if="icon" class="mr-1" :src="icon" :size="14" />

    <slot />
  </button>
</template>

<script lang="ts" setup>
import Icon from "@/components/basic/icon/Icon.vue";

// ** Props **
defineProps({
  icon: {
    type: String,
    default: "",
  },
  outlined: {
    type: Boolean,
    default: true,
  },
  background: {
    type: String,
    default: "primary",
  },
});
</script>

<style lang="scss" scoped>
.button {
  height: 30px;
  width: 100%;
  border-radius: 5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
