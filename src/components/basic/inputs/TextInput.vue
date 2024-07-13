<template>
  <input :value="modelValue" :placeholder="placeholder" @input="emitValue" />
</template>

<script lang="ts" setup>
// ** Props **
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue"]);

// ** Methods **
const emitValue = (event: Event): void => {
  emits("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<style lang="scss" scoped>
input {
  background: rgb(240, 240, 240);
  border: 0;
  border-radius: 5px;
  padding: 7px;
  text-indent: 5px;
  font-size: 12px;
  width: 100%;
}
</style>
