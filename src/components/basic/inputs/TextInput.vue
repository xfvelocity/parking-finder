<template>
  <div
    class="input"
    :class="{
      'input-icon': icon,
      'input-populated': modelValue,
      'input-active': isActive,
    }"
  >
    <Icon v-if="icon" :src="icon" :fill="iconColour" />
    <slot name="prepend" />

    <input
      ref="textInput"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emitValue"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="$emit('keydown.enter')"
    />

    <Icon
      v-if="modelValue && clearButton"
      class="input-close"
      src="close"
      :size="8"
      @click="clearInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import Icon from "@/components/basic/icon/Icon.vue";

// ** Props **
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
    required: true,
  },
  colour: {
    type: String,
    default: "black",
  },
  placeholder: {
    type: String,
    default: "",
  },
  selectOnFocus: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  iconColour: {
    type: String,
    default: "",
  },
  clearButton: {
    type: Boolean,
    default: true,
  },
});

// ** Emits **
const emit = defineEmits([
  "update:modelValue",
  "keydown.enter",
  "focus",
  "blur",
  "update:clear",
]);

// ** Data **
const isActive = ref<boolean>(false);
const textInput = ref<HTMLInputElement>();

// ** Methods **
const clearInput = (): void => {
  emit("update:modelValue", "");
  emit("update:clear");
};

const onFocus = (event: FocusEvent): void => {
  emit("focus", event);
  isActive.value = true;

  if (props.selectOnFocus && textInput.value) {
    textInput.value.select();
  }
};

const onBlur = (event: FocusEvent): void => {
  emit("blur", event);
  isActive.value = false;
};

const emitValue = (event: Event): void => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>
