<template>
  <div class="select">
    <div class="select-toggle input" @click="isSelectActive = true">
      <span class="pl-2">
        {{ selected?.text }}
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
        <IonPickerColumn :value="selected?.value" @ionChange="optionSelected">
          <IonPickerColumnOption
            v-for="(opt, i) in options"
            :value="opt.value"
            :key="i"
          >
            {{ opt.text }}
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
    type: [String, Number, Object, null] as PropType<
      string | number | SelectOption | null
    >,
    default: "",
    required: true,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
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
const selected = ref<SelectOption>();
const isSelectActive = ref<boolean>(false);
const loading = ref<boolean>(false);

// ** Methods **
const optionSelected = debounce((event: any): void => {
  emits("update:modelValue", event.target.value);
}, 300);

// // ** Watchers **
watch(
  () => props.modelValue,
  (value) => {
    const matchingOption: SelectOption | undefined = props.options.find(
      (option) => option.value == value,
    );

    selected.value = matchingOption;
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/theme/variables/_colours";

.select {
  position: relative;
  font-size: 12px;

  &-toggle {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid map.get(colours.$colours, "border");
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
