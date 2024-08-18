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

    <p class="add-location-price-add hover mt-1" @click="addPrice">Add price</p>

    <div class="mt-4">
      <CustomButton :loading="isSubmitLoading" @click="submitPrices">
        Submit
      </CustomButton>
      <CustomButton
        class="mt-1"
        :disabled="isSubmitLoading"
        outlined
        @click="$emit('close')"
      >
        Cancel
      </CustomButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AddPrices, Parking } from "@/types/map.types";

import { PropType, ref } from "vue";
import { hourOptions } from "@/composables/generic";
import { api } from "@/api/api";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import Select from "@/components/basic/inputs/Select.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";

// ** Props **
const props = defineProps({
  selectedParking: {
    type: Object as PropType<Parking>,
    default: null,
  },
});

// ** Emits **
const emits = defineEmits(["close"]);

// ** Data **
const isSubmitLoading = ref<boolean>(false);
const prices = ref<AddPrices[]>([
  {
    hours: 1,
    price: 0,
  },
]);

// ** Methods **
const addPrice = (): void => {
  prices.value.push({
    hours: 1,
    price: 0,
  });
};

const submitPrices = async (): Promise<void> => {
  isSubmitLoading.value = true;

  await api(
    "POST",
    `add-prices/${props.selectedParking._id}`,
    {
      prices: prices.value,
    },
    true
  );

  setTimeout(() => {
    prices.value = [];
    emits("close");

    isSubmitLoading.value = false;
  }, 3000);
};
</script>

<style lang="scss" scoped>
.currency {
  font-size: 10px;
}

.add-location {
  &-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-price {
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;

      :deep(.select) {
        width: 50%;
      }
    }

    &-add {
      text-align: right;
      color: map-get($colours, "primary");
      text-decoration: underline;
    }
  }
}
</style>
