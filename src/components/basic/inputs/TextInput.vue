<template>
  <div
    class="input"
    :class="{
      'input-populated': !!modelValue || modelValue === 0,
      'input-active': isActive,
    }"
  >
    <input
      :value="modelValue"
      :name="name"
      :type="type"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      @input="emitValue"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="disabled ? '' : $emit('keydown.enter')"
    />

    <label v-if="label" :for="name">
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";

// ** Props **
defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number, null],
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

// ** Methods **
const onFocus = (event: FocusEvent): void => {
  emit("focus", event);
  isActive.value = true;
};

const onBlur = (event: FocusEvent): void => {
  emit("blur", event);
  isActive.value = false;
};

const emitValue = (event: Event): void => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>
