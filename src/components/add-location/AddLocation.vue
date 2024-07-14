<template>
  <div class="add-location">
    <Select label="Pub" autocomplete />

    <div v-if="pints.length" class="add-location-pints">
      <div v-for="(pint, i) in pints" :key="i" class="add-location-pints-item">
        <TextInput label="Beer" v-model="pint.name" />
        <TextInput label="Price" v-model="pint.price" />
      </div>
    </div>

    <div class="add-location-pints-add hover" @click="addPint">
      <Icon src="plus" fill="blue" />

      <p>Add pint</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import Select from "@/components/basic/inputs/Select.vue";
import Icon from "@/components/basic/icon/Icon.vue";

const pints = ref<any[]>([]);

const addPint = (): void => {
  pints.value.push({
    name: "",
    price: 0,
  });
};
</script>

<style lang="scss" scoped>
.add-location {
  padding: 10px;
  max-width: 300px;
  margin: 0 auto;

  &-pints {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid rgb(226, 226, 226);
    border-radius: 5px;

    &-add {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;

      p {
        margin-left: 5px;
      }
    }
  }
}
</style>
