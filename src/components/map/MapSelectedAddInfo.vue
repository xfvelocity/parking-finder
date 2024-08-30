<template>
  <div class="add-info-price">
    <h3 class="mb-2 mt-4 mx-4">Add Prices</h3>

    <transition-group name="slide" tag="div">
      <SwipeDelete
        v-for="(price, i) in prices"
        :key="i"
        class="mt-2"
        @delete="deletePrice(i)"
      >
        <div class="add-info-price-item px-4">
          <SelectScroller v-model="price.hours" :options="hourOptions" />

          <TextInput
            v-model="price.price"
            select-on-focus
            :clear-button="false"
          >
            <template #prepend>
              <span class="add-info-price-symbol">£</span>
            </template>
          </TextInput>
        </div>
      </SwipeDelete>
    </transition-group>

    <div class="add-info-price-add w-100 mt-2 mr-4">
      <Icon class="hover ml-auto" src="plus" fill="primary" @click="addPrice" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AddPrices } from "@/types/map.types";

import { ref } from "vue";
import { hourOptions } from "@/composables/generic";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import SelectScroller from "@/components/basic/inputs/SelectScroller.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import SwipeDelete from "@/components/basic/swipe-delete/SwipeDelete.vue";

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
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.add-info {
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
      display: flex;
    }

    &-symbol {
      font-size: 12px;
      margin-left: 3px;
      color: map-get($colours, "grey-darken-2");
    }
  }
}
</style>
