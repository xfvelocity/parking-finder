<template>
  <button
    class="button"
    :class="[
      outlined
        ? `button-border text-${backgroundColour} border-${backgroundColour}`
        : `text-${textColour} bg-${backgroundColour}`,
      {
        hover: !disabled,
      },
    ]"
    :disabled="disabled || loading"
  >
    <Icon v-if="icon" class="mr-1" :src="icon" :size="14" />

    <slot />

    <LoadingSpinner v-if="loading" class="ml-1" colour="white" :size="14" />
  </button>
</template>

<script lang="ts" setup>
import Icon from "@/components/basic/icon/Icon.vue";
import LoadingSpinner from "@/components/basic/loading/LoadingSpinner.vue";

// ** Props **
defineProps({
  icon: {
    type: String,
    default: "",
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  backgroundColour: {
    type: String,
    default: "primary",
  },
  textColour: {
    type: String,
    default: "white",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.button {
  height: 35px;
  width: 100%;
  border-radius: 5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  &-border {
    border: 1px solid;
    background: none;
  }
}
</style>
