<template>
  <div v-if="infoType === INFO_TYPE.PRICE" class="add-info-price">
    <div class="add-info-heading my-4">
      <h3>Adding Prices</h3>
      <p class="mt-1">
        Please add the prices below by selecting a length of time and the price.
      </p>
    </div>

    <transition-group name="slide" tag="div">
      <SwipeDelete
        v-for="(price, i) in prices"
        :key="i"
        class="mt-2"
        @delete="deletePrice(i)"
      >
        <div class="add-info-price-item px-4">
          <SelectScroller
            v-model="price.hours"
            teleport-to="#addPriceScroller"
            :options="hourOptions"
          />

          <TextInput
            v-model="price.price"
            select-on-focus
            type="number"
            :clear-button="false"
          >
            <template #prepend>
              <span class="add-info-price-symbol">£</span>
            </template>
          </TextInput>
        </div>
      </SwipeDelete>
    </transition-group>

    <p
      class="mt-4 text-primary text-center text-underline hover"
      @click="addPrice"
    >
      Add another price
    </p>
  </div>

  <div v-if="infoType === INFO_TYPE.INFO" class="add-info-info p-4">
    <div class="add-info-heading mb-4">
      <h3>Adding Additional Info</h3>
      <p>Please add any additional info to help users choose this carpark.</p>
    </div>

    <div>
      <TextInput
        v-model="info.spaces"
        label="Spaces"
        placeholder="Amount of parking spaces"
        class="mb-3"
      />

      <TextInput
        v-model="info.disabledSpaces"
        label="Disabled spaces"
        placeholder="Amount of disabled parking spaces"
      />
    </div>
  </div>

  <div v-if="infoType === INFO_TYPE.TIMES" class="add-info-time p-4">
    <div class="add-info-heading mb-4">
      <h3>Adding Opening Hours</h3>
      <p>Please add opening hours to let people know when the carparks open</p>
    </div>

    <div></div>
  </div>
</template>

<script lang="ts" setup>
import type { AddPrices } from "@/types/map.types";

import { PropType, ref } from "vue";
import { hourOptions } from "@/composables/generic";
import { INFO_TYPE } from "@/content/enums";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import SelectScroller from "@/components/basic/inputs/SelectScroller.vue";
import SwipeDelete from "@/components/basic/swipe-delete/SwipeDelete.vue";

// ** Props **
const props = defineProps({
  infoType: {
    type: String as PropType<INFO_TYPE>,
    default: INFO_TYPE.PRICE,
  },
});

// ** Data **
const prices = ref<AddPrices[]>([
  {
    hours: 1,
    price: 1,
  },
  {
    hours: 2,
    price: 2,
  },
  {
    hours: 3,
    price: 3,
  },
]);
const info = ref<any>({
  spaces: null,
  disabledSpaces: null,
});

// ** Methods **
const addPrice = (): void => {
  prices.value.push({
    hours: 1,
    price: 0,
  });
};

const deletePrice = (index: number): void => {
  prices.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.slide {
  &-enter-active,
  &-leave-active {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  &-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }

  &-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.add-info {
  &-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-heading {
    max-width: 240px;
    margin: 0 auto;
    text-align: center;
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
      display: flex;
      align-items: center;
    }

    &-symbol {
      font-size: 12px;
      margin-left: 3px;
      color: map-get($colours, "grey-darken-2");
    }
  }
}
</style>
