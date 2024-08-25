<template>
  <DragModal
    :model-value="modelValue"
    :initial-breakpoint="0.4"
    :breakpoints="[0, 0.4]"
    :backdrop-breakpoint="0.4"
    :z-index="11"
  >
    <template #header>
      <h4>
        {{
          isToDate
            ? "When would you like to park until?"
            : "When would you like to park from?"
        }}
      </h4>
    </template>

    <!-- Time picker -->
    <IonDatetime
      v-if="isToDate"
      class="mx-auto"
      :value="toDate"
      presentation="time"
      :min="getCurrentTime(true)"
      mode="md"
      prefer-wheel
      minuteValues="0"
      @ion-change="toDate = $event.detail.value?.toString() || ''"
    />

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
        <CustomButton
          :height="25"
          outlined
          @click="emits('update:modelValue', false)"
        >
          Skip
        </CustomButton>

        <CustomButton @click="isToDate = true"> Next </CustomButton>
      </template>

      <CustomButton v-else @click="searchDate"> Search </CustomButton>
    </div>
  </DragModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getCurrentTime } from "@/composables/generic";

import { IonDatetime } from "@ionic/vue";
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
  currentToDate: {
    type: String,
    default: "",
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "search"]);

// ** Data **
const fromDate = ref<string>("");
const toDate = ref<string>("");
const isToDate = ref<boolean>(false);

// ** Methods **
const searchDate = (): void => {
  emits("search", fromDate.value, toDate.value);
  emits("update:modelValue", false);

  isToDate.value = false;
};

// ** Watchers **
watch(
  [() => props.currentFromDate, () => props.currentToDate],
  () => {
    if (!props.currentFromDate) {
      fromDate.value = getCurrentTime();
      toDate.value = getCurrentTime(true);
    } else {
      fromDate.value = props.currentFromDate;
      toDate.value = props.currentToDate;
    }
  },
  { immediate: true }
);

watch(fromDate, () => {
  console.log("firing");
  toDate.value = fromDate.value;
});
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
