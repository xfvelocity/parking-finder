<template>
  <div
    v-if="isSnackbarOpen"
    class="snackbar p-2"
    :class="` bg-${snackbar.background}`"
  >
    <Icon v-if="snackbar.icon" class="mr-2" :src="snackbar.icon" fill="white" />

    <p class="text-white">{{ snackbar.text }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/stores/config";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

import Icon from "@/components/basic/icon/Icon.vue";

// ** Data **
const configStore = useConfigStore();

const { snackbar } = storeToRefs(configStore);
const isSnackbarOpen = ref<boolean>(false);

// ** Watchers **
watch(
  snackbar,
  () => {
    if (snackbar.value.text) {
      isSnackbarOpen.value = true;

      setTimeout(() => {
        isSnackbarOpen.value = false;
      }, 3000);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@use "@/theme/mixins";

.snackbar {
  @include mixins.center(true, false);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 35px;
  border-radius: 5px;
  width: 300px;
  bottom: 20px;
  font-weight: 500;
  box-shadow: 0 4px 4px 4px rgba(0, 0, 0, 0.1);
}
</style>
