<template>
  <div
    class="input"
    :class="{
      'input-icon': prependIcon || appendIcon,
      'input-populated': modelValue,
      'input-active': isActive,
    }"
  >
    <Icon
      v-if="prependIcon"
      :src="prependIcon"
      :fill="prependIconColour"
      @click="$emit('click:prepend')"
    />

    <slot name="prepend" />

    <input
      ref="textInput"
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :autocomplete="autocomplete"
      :required="required"
      :name="name"
      @input="emitValue"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="$emit('keydown.enter')"
    />

    <Icon
      v-if="modelValue && clearButton"
      class="mr-2"
      src="close"
      :size="12"
      @click="clearInput"
    />

    <Icon
      v-if="appendIcon"
      class="hover mr-1"
      :src="appendIcon"
      :fill="appendIconColour"
      @click="$emit('click:append')"
    />

    <label v-if="label">
      {{ label }}
    </label>
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
  prependIcon: {
    type: String,
    default: "",
  },
  prependIconColour: {
    type: String,
    default: "grey-darken-1",
  },
  appendIcon: {
    type: String,
    default: "",
  },
  appendIconColour: {
    type: String,
    default: "grey-darken-1",
  },
  clearButton: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  autocomplete: {
    type: String,
    default: "off",
  },
  required: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
});

// ** Emits **
const emit = defineEmits([
  "update:modelValue",
  "keydown.enter",
  "focus",
  "blur",
  "update:clear",
  "click:prepend",
  "click:append",
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
