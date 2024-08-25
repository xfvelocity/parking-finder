<template>
  <DragModal
    :model-value="modelValue"
    :initial-breakpoint="0.4"
    :breakpoints="[0, 0.4]"
    :backdrop-breakpoint="0.4"
    :z-index="11"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <template #header>
      <h4>When would you like to park?</h4>
    </template>

    <IonDatetime
      class="mx-auto"
      :value="selectedTime"
      presentation="date-time"
      prefer-wheel
      @ion-change="selectedTime = $event.detail.value?.toString() || ''"
    />

    <div class="time-picker-buttons p-4">
      <CustomButton
        :height="25"
        outlined
        @click="emits('update:modelValue', false)"
      >
        Skip
      </CustomButton>

      <CustomButton @click="emits('search', selectedTime)">
        Search
      </CustomButton>
    </div>
  </DragModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { IonDatetime } from "@ionic/vue";
import DragModal from "@/components/basic/modal/DragModal.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";

// ** Props **
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "search"]);

// ** Data **
const selectedTime = ref<string>("");
</script>

<style lang="scss" scoped>
.time-picker {
  &-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
