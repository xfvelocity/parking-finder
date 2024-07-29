<template>
  <button class="button hover">
    <Icon v-if="icon" :src="icon" :size="14" />

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
});
</script>

<style lang="scss" scoped>
.button {
  height: 30px;
  width: 100%;
  border-radius: 5px;
  background: #{$primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  .icon {
    margin-right: 5px;
  }
}
</style>
