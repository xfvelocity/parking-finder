<template>
  <div class="add-location-content">
    <div v-if="prices.length" class="add-location-price">
      <div
        v-for="(price, i) in prices"
        :key="i"
        class="add-location-price-item"
      >
        <Select v-model="price.hours" :options="hourOptions" />

        <TextInput v-model="price.price" select-on-focus :clear-button="false">
          <template #prepend>
            <span class="currency">£</span>
          </template>
        </TextInput>
      </div>
    </div>

    <p class="add-location-price-add hover" @click="addPrice">Add price</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import Select from "@/components/basic/inputs/Select.vue";

// ** Emits **
defineEmits(["close"]);

// ** Data **
const prices = ref<any[]>([
  {
    hours: 1,
    price: 0,
  },
]);
const hourOptions = [
  {
    text: "1 hour",
    value: 1,
  },
  {
    text: "2 hours",
    value: 2,
  },
  {
    text: "3 hours",
    value: 3,
  },
];

// ** Methods **
const addPrice = (): void => {
  prices.value.push({
    hours: 0,
    price: 0,
  });
};
</script>

<style lang="scss" scoped>
.currency {
  font-size: 10px;
}

.add-location {
  &-price {
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      :deep(.select) {
        width: 50%;
      }
    }

    &-add {
      text-align: right;
      color: $primary;
      text-decoration: underline;
      margin-top: 5px;
    }
  }
}
</style>
