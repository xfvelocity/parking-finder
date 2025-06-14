<template>
  <div v-if="selectedParking">
    <div class="p-4">
      <h4 class="mb-2">Prices</h4>

      <ul v-if="selectedParking.prices.length">
        <li
          v-for="(price, i) in formattedPrices.prices"
          :key="i"
          :class="{
            'text-fw-600': selectedHours === price.hours,
          }"
        >
          <div>{{ price.hours }} hours</div>

          <div>£{{ price.price.toFixed(2) }}</div>
        </li>
      </ul>

      <p v-else>No prices added</p>
    </div>

    <template v-if="formattedPrices.app.length">
      <hr class="divider" />

      <div class="p-4">
        <h4 class="mb-2">App Prices</h4>

        <ul>
          <li
            v-for="(price, i) in formattedPrices.app"
            :key="i"
            :class="{
              'text-fw-600': selectedHours === price.hours,
            }"
          >
            <div>{{ price.hours }} hours</div>

            <div>£{{ price.price.toFixed(2) }}</div>
          </li>
        </ul>
      </div>
    </template>

    <div>
      <hr class="divider" />

      <div class="p-4">
        <h4 class="mb-2">Info</h4>

        <p class="flex-between">
          Spaces: <span>{{ selectedParking.info.spaces || "?" }}</span>
        </p>
        <p class="mt-1 flex-between">
          Disabled spaces:
          <span>{{ selectedParking.info.disabledSpaces || "?" }}</span>
        </p>
      </div>

      <hr class="divider" />

      <div class="p-4">
        <h4 class="mb-2">Opening hours</h4>

        <ul>
          <li
            v-for="(openingTime, i) in Object.keys(
              selectedParking.openingHours,
            )"
            :key="i"
          >
            <span class="text-transform-capitalize"> {{ openingTime }}: </span>

            {{
              formatOpeningHours(
                selectedParking.openingHours[openingTime as keyof ParkingHours],
              ) || "?"
            }}
          </li>
        </ul>
      </div>

      <hr class="divider" />

      <div class="p-4 text-center">
        <template v-if="selectedParking.pendingInfoByUser">
          <p>Your added information is currently pending approval.</p>
        </template>

        <template v-else-if="selectedParking.type !== 'ncp'">
          <p>
            This location is missing information. Would you like to add some to
            help other users?
          </p>

          <p
            class="text-primary text-underline mt-2 hover"
            @click="toggleAddInfo"
          >
            Add Parking Info
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Parking, ParkingPrice, ParkingHours } from "@/types/map.types";
import type { PropType } from "vue";

import { computed, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useMapStore } from "@/stores/map";

// ** Props **
const props = defineProps({
  selectedParking: {
    type: [Object, null] as PropType<Parking | null>,
    default: null,
  },
});

// ** Emits **
const emits = defineEmits(["update:addingInfo", "open:authModal"]);

// ** Data **
const userStore = useUserStore();
const mapStore = useMapStore();

const selectedHours = ref<number>(0);

// ** Computed **
const formattedPrices = computed<{
  prices: ParkingPrice[];
  app: ParkingPrice[];
}>(() => {
  const app =
    props.selectedParking?.prices.filter(
      (price: ParkingPrice) => price.appPrice,
    ) || [];
  const prices =
    props.selectedParking?.prices.filter(
      (price: ParkingPrice) => !price.appPrice,
    ) || [];

  return {
    prices,
    app,
  };
});

// ** Methods **
const toggleAddInfo = (): void => {
  if (userStore.accessToken) {
    emits("update:addingInfo", true);
  } else {
    emits("open:authModal", true);
  }
};

const checkMatchingHours = (): void => {
  if (mapStore.filters.hours && props.selectedParking) {
    const sortedArray =
      props.selectedParking?.prices.sort((a, b) => a.hours - b.hours) || [];

    selectedHours.value = sortedArray.filter(
      (x) => x.hours >= mapStore.filters.hours,
    )[0]?.hours;
  } else {
    selectedHours.value = 0;
  }
};

const formatOpeningHours = (hours: string[]): string => {
  if (hours.length) {
    if (hours[0] === "00:00" && hours[1] === "24:00") {
      return "24 hours";
    } else {
      return `${hours[0]} - ${hours[1]}`;
    }
  } else {
    return "";
  }
};

// ** Watchers **
watch(() => props.selectedParking, checkMatchingHours, { immediate: true });
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
  }
}
</style>
