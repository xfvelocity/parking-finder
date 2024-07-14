<template>
  <div
    class="input"
    :class="{
      'input-populated': modelValue,
      'input-active': isActive,
    }"
  >
    <input
      ref="textInput"
      :value="modelValue"
      @input="emitValue"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="$emit('keydown.enter')"
    />

    <label v-if="label">
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// ** Props **
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
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
});

// ** Emits **
const emit = defineEmits([
  "update:modelValue",
  "keydown.enter",
  "focus",
  "blur",
]);

// ** Data **
const isActive = ref<boolean>(false);
const textInput = ref<HTMLInputElement>();

// ** Methods **
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
