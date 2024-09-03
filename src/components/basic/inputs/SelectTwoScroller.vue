<template>
  <div class="select">
    <div class="select-toggle input" @click="isSelectActive = true">
      <span class="pl-2">
        {{ selected.map((x) => x.text).join(":") }}
      </span>

      <div class="ml-auto">
        <LoadingSpinner v-if="loading" class="mr-2" :size="12" />
        <Icon
          class="select-arrow"
          :class="{ 'xf-select-arrow-active': isSelectActive }"
          src="chevron-down"
          :size="10"
          fill="grey"
          @click.stop="isSelectActive = !isSelectActive"
        />
      </div>
    </div>
  </div>

  <teleport :to="teleportTo" :disabled="!teleportTo">
    <DragModal
      v-model="isSelectActive"
      :breakpoints="[0, 0.3]"
      :initial-breakpoint="0.3"
      :backdrop-breakpoint="0.3"
    >
      <IonPicker>
        <IonPickerColumn
          v-for="(opt, i) in options"
          :key="i"
          :value="selected[i].value"
          @ionChange="optionSelected($event, i)"
        >
          <IonPickerColumnOption
            v-for="(o, index) in opt"
            :key="index"
            :value="o.value"
          >
            {{ o.text }}
          </IonPickerColumnOption>
        </IonPickerColumn>
      </IonPicker>
    </DragModal>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from "vue";
import { SelectOption } from "@/types/app.types";
import { debounce } from "@/composables/generic";

import { IonPicker, IonPickerColumn, IonPickerColumnOption } from "@ionic/vue";
import LoadingSpinner from "@/components/basic/loading/LoadingSpinner.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import DragModal from "@/components/basic/modal/DragModal.vue";

// ** Props **
const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
    required: true,
  },
  options: {
    type: Array as PropType<SelectOption[][]>,
    default: () => [],
    required: true,
  },
  teleportTo: {
    type: String,
    default: "",
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue"]);

// ** Data **
const selected = ref<SelectOption[]>([]);
const isSelectActive = ref<boolean>(false);
const loading = ref<boolean>(false);

// ** Methods **
const optionSelected = debounce((event: any, index: number): void => {
  selected.value[index] = {
    text: event.target.value,
    value: event.target.value,
  };
  emits(
    "update:modelValue",
    selected.value.map((selected) => selected.value)
  );
}, 300);

// // ** Watchers **
watch(
  () => props.modelValue,
  (value) => {
    selected.value = props.options.map((option, i) => {
      const matchingOption: SelectOption | undefined = option.find(
        (opt) => opt.value === value[i]
      );

      return matchingOption;
    }) as SelectOption[];
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  font-size: 12px;

  &-toggle {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid map-get($colours, "border");
    position: relative;
    color: black;
  }

  &-arrow {
    margin-top: 5px;
    margin-right: 5px;
    transition: all 0.4s ease-out;

    &-active {
      transform: rotate(180deg);
    }
  }
}
</style>
