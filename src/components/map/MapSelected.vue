<template>
  <SlideUpModal
    :model-value="!!selectedParking"
    height="100%"
    @update:model-value="$emit('update:selectedParking', null)"
  >
    <div v-if="selectedParking" class="map-selected">
      <div class="map-selected-header p-4">
        <Icon
          src="chevron-left"
          fill="grey"
          @click="$emit('update:selectedParking', null)"
        />

        <h4>{{ selectedParking.name }}</h4>
      </div>

      <div class="map-selected-content p-4">
        <div>
          <h5 class="mb-2">Prices</h5>

          <ul v-if="selectedParking.prices.length">
            <li
              v-for="(price, i) in formattedPrices.prices"
              :key="i"
              :class="{
                'text-cheap text-fw-600': selectedHours === price.hours,
              }"
            >
              <div>{{ price.hours }} hours</div>

              <div>£{{ price.price.toFixed(2) }}</div>
            </li>
          </ul>

          <div v-else-if="!addingPrice" class="map-selected-price-add">
            <p>No prices added</p>
            <p
              class="map-selected-price-add-btn hover"
              @click="addingPrice = true"
            >
              Add prices
            </p>
          </div>
        </div>

        <template v-if="formattedPrices.app.length">
          <hr class="divider my-4" />

          <h5 class="mb-2">App Prices</h5>

          <ul>
            <li
              v-for="(price, i) in formattedPrices.app"
              :key="i"
              :class="{
                'text-cheap text-fw-600': selectedHours === price.hours,
              }"
            >
              <div>{{ price.hours }} hours</div>

              <div>£{{ price.price.toFixed(2) }}</div>
            </li>
          </ul>
        </template>

        <AddPrices
          v-if="addingPrice"
          :selected-parking="selectedParking"
          @close="addingPrice = false"
        />

        <div v-if="selectedParking.info && !addingPrice">
          <hr class="divider my-4" />

          <div>
            <h5 class="mb-2">Info</h5>

            <p v-if="selectedParking.info.spaces" class="flex-between">
              Spaces: <span>{{ selectedParking.info.spaces }}</span>
            </p>
            <p
              v-if="selectedParking.info.disabledSpaces"
              class="mt-1 flex-between"
            >
              Disabled spaces:
              <span>{{ selectedParking.info.disabledSpaces }}</span>
            </p>
          </div>
          <hr class="divider my-4" />

          <div>
            <h5 class="mb-2">Opening hours</h5>

            <ul v-if="hasValidHours">
              <li
                v-for="(openingTime, i) in Object.keys(
                  selectedParking.info.openingHours
                )"
                :key="i"
              >
                <span class="text-transform-capitalize">
                  {{ openingTime }}:
                </span>

                {{
                  formatOpeningHours(
                    selectedParking.info.openingHours[
                      openingTime as keyof ParkingHours
                    ]
                  )
                }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="!addingPrice" class="map-selected-button mt-auto px-4 py-3">
        <CustomButton icon="directions" @click="openDirections">
          Directions
        </CustomButton>
      </div>
    </div>
  </SlideUpModal>
</template>

<script lang="ts" setup>
import type { Parking, ParkingPrice, ParkingHours } from "@/types/map.types";

import { computed, ref, watch, type PropType } from "vue";
import { useMapStore } from "@/stores/map";

import Icon from "@/components/basic/icon/Icon.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";
import AddPrices from "@/components/add-prices/AddPrices.vue";
import SlideUpModal from "@/components/basic/modal/SlideUpModal.vue";

// ** Props **
const props = defineProps({
  selectedParking: {
    type: [Object, null] as PropType<Parking | null>,
    default: null,
  },
  showChevron: {
    type: Boolean,
    default: false,
  },
});

// ** Data **
const mapStore = useMapStore();

const addingPrice = ref<boolean>(false);
const selectedHours = ref<number>(0);

// ** Computed **
const hasValidHours = computed<boolean>(() => {
  return Object.values(props.selectedParking?.info?.openingHours || {}).some(
    (x: any) => x[0]
  );
});

const formattedPrices = computed<{
  prices: ParkingPrice[];
  app: ParkingPrice[];
}>(() => {
  const app =
    props.selectedParking?.prices.filter((price: any) => price.appPrice) || [];
  const prices =
    props.selectedParking?.prices.filter((price: any) => !price.appPrice) || [];

  return {
    prices,
    app,
  };
});

// ** Methods **
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

const checkMatchingHours = (): void => {
  if (mapStore.filters.hours && props.selectedParking) {
    const sortedArray =
      props.selectedParking?.prices.sort((a, b) => a.hours - b.hours) || [];

    selectedHours.value = sortedArray.filter(
      (x) => x.hours >= mapStore.filters.hours
    )[0]?.hours;
  } else {
    selectedHours.value = 0;
  }
};

const openDirections = (): void => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${props.selectedParking?.address}`
  );
};

// ** Watchers **
watch(
  () => props.selectedParking,
  () => {
    if (!props.selectedParking) {
      addingPrice.value = false;
    }

    checkMatchingHours();
  }
);
</script>

<style lang="scss" scoped>
.map-selected {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    display: grid;
    align-items: center;
    grid-template-columns: 30px 1fr 30px;
    border-bottom: 1px solid map-get($colours, "border");
  }

  &-content {
    overflow-y: auto;
  }

  &-button {
    border-top: 1px solid map-get($colours, "border");
  }

  h4 {
    font-size: 14px;
    grid-column-start: 2;
    text-align: center;
  }

  h5 {
    font-size: 14px;
  }

  &-price-add {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;

    &-btn {
      color: map-get($colours, "primary");
      text-decoration: underline;
    }
  }

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
}
</style>
