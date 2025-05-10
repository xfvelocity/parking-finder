<template>
  <div v-if="infoType === INFO_TYPE.PRICE" class="add-info-price">
    <div class="add-info-heading my-4">
      <h3>Adding Prices</h3>
      <p class="mt-1">
        Please add the prices below by selecting a length of time and the price.
      </p>
    </div>

    <transition-group name="slide" tag="div">
      <div v-for="(price, i) in prices" :key="i" class="mt-2">
        <div class="add-info-price-item px-4">
          <SelectScroller
            v-model="price.hours"
            teleport-to="#addPriceScroller"
            :options="hourOptions"
          />

          <TextInput v-model="price.price" type="number" :clear-button="false">
            <template #prepend>
              <span class="add-info-price-symbol">£</span>
            </template>
          </TextInput>

          <Icon
            class="hover"
            src="close"
            fill="red-lighten-3"
            @click="deletePrice(i)"
          />
        </div>
      </div>
    </transition-group>

    <div class="add-info-price-add hover bg-primary" @mousedown="addPrice">
      <Icon src="plus" :size="10" fill="white" />

      <p class="ml-1 text-white text-center">Add Price</p>
    </div>
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
        type="number"
        class="mb-3"
      />

      <TextInput
        v-model="info.disabledSpaces"
        label="Disabled spaces"
        type="number"
        placeholder="Amount of disabled parking spaces"
      />
    </div>
  </div>

  <div v-if="infoType === INFO_TYPE.TIMES" class="add-info-time p-4">
    <div class="add-info-heading mb-4">
      <h3>Adding Opening Hours</h3>
      <p>Please add opening hours to let people know when the carparks open</p>
    </div>

    <div>
      <div
        v-for="(timeKey, i) in Object.keys(openingHours)"
        :key="i"
        class="add-info-times mt-3"
      >
        <p class="text-transform-capitalize">{{ timeKey }}</p>

        <Checkbox
          v-model="openingHours[timeKey as keyof NewParkingTimes].isOpen"
        />

        <div class="add-info-times-inputs">
          <template
            v-if="openingHours[timeKey as keyof NewParkingTimes].isOpen"
          >
            <SelectTwoScroller
              v-model="
                openingHours[timeKey as keyof NewParkingTimes]
                  .openingTime as string[]
              "
              teleport-to="#addPriceScroller"
              :options="timeOptions"
            />
            <SelectTwoScroller
              v-model="
                openingHours[timeKey as keyof NewParkingTimes]
                  .closingTime as string[]
              "
              teleport-to="#addPriceScroller"
              :options="timeOptions"
            />
          </template>

          <p v-else>Closed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  AddPrices,
  NewParkingInfo,
  NewParkingTime,
  NewParkingTimes,
} from "@/types/map.types";

import { PropType, ref, watch } from "vue";
import { hourOptions } from "@/composables/generic";
import { INFO_TYPE } from "@/content/enums";
import { timeOptions } from "@/content/time";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import SelectScroller from "@/components/basic/inputs/SelectScroller.vue";
import SelectTwoScroller from "@/components/basic/inputs/SelectTwoScroller.vue";
import Checkbox from "@/components/basic/checkbox/Checkbox.vue";
import Icon from "@/components/basic/icon/Icon.vue";

// ** Data **
const initialTime: NewParkingTime = {
  openingTime: ["09", "00"],
  closingTime: ["17", "00"],
  isOpen: false,
};

// ** Props **
const props = defineProps({
  infoType: {
    type: String as PropType<INFO_TYPE>,
    default: INFO_TYPE.PRICE,
  },
});

// ** Emits **
const emits = defineEmits(["update:info:disabled", "update:info:values"]);

// ** Data **
const prices = ref<AddPrices[]>([
  {
    hours: 1,
    price: 0,
  },
]);
const info = ref<NewParkingInfo>({
  spaces: null,
  disabledSpaces: null,
});
const openingHours = ref<NewParkingTimes>({
  monday: { ...initialTime },
  tuesday: { ...initialTime },
  wednesday: { ...initialTime },
  thursday: { ...initialTime },
  friday: { ...initialTime },
  saturday: { ...initialTime },
  sunday: { ...initialTime },
});

// ** Methods **
const addPrice = (e: MouseEvent): void => {
  e.preventDefault();

  prices.value.push({
    hours: 1,
    price: 0,
  });
};

const deletePrice = (index: number): void => {
  prices.value.splice(index, 1);
};

// ** Watchers **
watch(
  prices,
  () => {
    const isDisabled = !prices.value.every((price) => price.price);

    emits("update:info:disabled", isDisabled);
  },
  { deep: true },
);

watch(
  info,
  () => {
    const isDisabled = !Object.values(info.value).every(
      (value: any) => value || value === 0,
    );

    emits("update:info:disabled", isDisabled);
  },
  { deep: true },
);

watch(openingHours, () => {}, { deep: true });

watch(
  () => props.infoType,
  () => {
    emits("update:info:values", {
      prices: prices.value,
      info: info.value,
      openingHours: openingHours.value,
    });
  },
);
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/theme/variables/_colours";

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

  &-times {
    display: grid;
    align-items: center;
    grid-template-columns: 110px 30px 1fr;

    &-day {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &-inputs {
      display: flex;
      justify-self: end;
      gap: 5px;

      :deep(.select-toggle) {
        width: 65px;
        height: 28px;
      }
    }
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
      justify-content: center;
      padding: 3px 0;
      border-radius: 5px;
      margin: 15px 20px;
    }

    &-symbol {
      font-size: 12px;
      margin-left: 3px;
      color: map.get(colours.$colours, "grey-darken-2");
    }
  }
}
</style>
