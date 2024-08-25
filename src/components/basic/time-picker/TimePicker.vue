<template>
  <DragModal
    :model-value="modelValue"
    :initial-breakpoint="0.4"
    :breakpoints="[0, 0.4]"
    :backdrop-breakpoint="0.4"
    :z-index="11"
    @update:model-value="closeModal"
  >
    <template #header>
      <h4>
        {{
          isToDate
            ? "How long would you like to park?"
            : "When would you like to park from?"
        }}
      </h4>
    </template>

    <!-- Time picker -->
    <IonPicker v-if="isToDate" value="1">
      <IonPickerColumn>
        <IonPickerColumnOption
          v-for="(opt, i) in hourOptions"
          :value="opt.value"
          :key="i"
        >
          {{ opt.text }}
        </IonPickerColumnOption>
      </IonPickerColumn>
    </IonPicker>

    <!-- Date picker -->
    <IonDatetime
      v-else
      class="mx-auto"
      :value="fromDate"
      presentation="date-time"
      mode="md"
      :min="getCurrentTime()"
      prefer-wheel
      minuteValues="0"
      @ion-change="fromDate = $event.detail.value?.toString() || ''"
    />

    <div class="time-picker-buttons p-4">
      <template v-if="!isToDate">
        <CustomButton :height="25" outlined @click="skip"> Skip </CustomButton>

        <CustomButton @click="isToDate = true"> Next </CustomButton>
      </template>

      <CustomButton v-else @click="searchDate"> Search </CustomButton>
    </div>
  </DragModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getCurrentTime, hourOptions } from "@/composables/generic";

import {
  IonDatetime,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
} from "@ionic/vue";
import DragModal from "@/components/basic/modal/DragModal.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";

// ** Props **
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  currentFromDate: {
    type: String,
    default: "",
  },
  currentToHour: {
    type: Number,
    default: 0,
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "search"]);

// ** Data **
const fromDate = ref<string>("");
const toHour = ref<number>(1);
const isToDate = ref<boolean>(false);

// ** Methods **
const searchDate = (): void => {
  emits("search", fromDate.value, toHour.value);
  emits("update:modelValue", false);

  isToDate.value = false;
};

const closeModal = (): void => {
  emits("update:modelValue", false);
  isToDate.value = false;
};

const skip = (): void => {
  isToDate.value = true;
  fromDate.value = "";
};

// ** Watchers **
watch(
  [
    () => props.currentFromDate,
    () => props.currentToHour,
    () => props.modelValue,
  ],
  () => {
    fromDate.value = props.currentFromDate || getCurrentTime();
    toHour.value = props.currentToHour || 1;
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
