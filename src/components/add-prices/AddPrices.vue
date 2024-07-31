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

    <div class="mt-auto">
      <CustomButton :loading="isSubmitLoading" @click="submitPrices">
        Submit
      </CustomButton>
      <CustomButton class="mt-1" :disabled="isSubmitLoading" outlined>
        Cancel
      </CustomButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import Select from "@/components/basic/inputs/Select.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";
import axios from "axios";

// ** Props **
const props = defineProps({
  selectedParking: {
    type: Object as PropType<any>,
    default: null,
  },
});

// ** Emits **
const emits = defineEmits(["close"]);

// ** Data **
const isSubmitLoading = ref<boolean>(false);
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
    hours: 1,
    price: 0,
  });
};

const submitPrices = async (): Promise<void> => {
  isSubmitLoading.value = true;

  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/add-prices/${props.selectedParking.id}`,
    {
      prices: prices.value,
    },
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
