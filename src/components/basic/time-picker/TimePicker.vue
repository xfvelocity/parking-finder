<template>
  <DragModal
    :model-value="modelValue"
    :initial-breakpoint="0.45"
    :breakpoints="[0, 0.45]"
    :backdrop-breakpoint="0.45"
    :z-index="11"
    @update:model-value="emits('update:modelValue', false)"
  >
    <template #header>
      <h4>How long would you like to park for?</h4>
    </template>

    <!-- Time picker -->
    <IonPicker>
      <IonPickerColumn
        :value="hour"
        @ion-change="hour = parseInt(($event.detail.value || 1).toString())"
      >
        <IonPickerColumnOption
          v-for="(opt, i) in hourOptions"
          :value="opt.value"
          :key="i"
        >
          {{ opt.text }}
        </IonPickerColumnOption>
      </IonPickerColumn>
    </IonPicker>

    <div class="time-picker-buttons p-4">
      <CustomButton outlined @click="clear"> Clear </CustomButton>

      <CustomButton @click="searchDate"> Search </CustomButton>
    </div>
  </DragModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { hourOptions } from "@/composables/generic";

import { IonPicker, IonPickerColumn, IonPickerColumnOption } from "@ionic/vue";
import DragModal from "@/components/basic/modal/DragModal.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";

// ** Props **
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  currentHour: {
    type: Number,
    default: 0,
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "search"]);

// ** Data **
const hour = ref<number>(1);

// ** Methods **
const searchDate = (): void => {
  emits("search", hour.value);
  emits("update:modelValue", false);
};

const clear = (): void => {
  hour.value = 1;
  emits("search", 0);
  emits("update:modelValue", false);
};

// ** Watchers **
watch(
  [() => props.currentHour, () => props.modelValue],
  () => {
    hour.value = props.currentHour || 1;
  },
  { immediate: true }
);
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
