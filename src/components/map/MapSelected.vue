<template>
  <SlideUpModal
    :model-value="selectedParking"
    height="300px"
    @update:model-value="$emit('update:selectedParking', null)"
  >
    <div class="map-selected">
      <div class="map-selected-header">
        <Icon v-if="showChevron" src="chevron-left" fill="grey" />

        <h4>{{ selectedParking.displayName.text }}</h4>
      </div>

      <hr class="divider" />

      <div>
        <h5>Prices</h5>

        <ul v-if="selectedParking.prices">
          <li v-for="(price, i) in selectedParking.prices" :key="i">
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

      <AddPrices
        v-if="addingPrice"
        :selected-parking="selectedParking"
        @close="addingPrice = false"
      />

      <div v-if="selectedParking.info && !addingPrice">
        <hr class="divider" />

        <div class="mb-2">
          <h5>Info</h5>
        </div>
      </div>

      <div v-if="!addingPrice" class="mt-auto">
        <CustomButton icon="directions" @click="openDirections">
          Directions
        </CustomButton>
      </div>
    </div>
  </SlideUpModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from "vue";

import Icon from "@/components/basic/icon/Icon.vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";
import AddPrices from "@/components/add-prices/AddPrices.vue";
import SlideUpModal from "@/components/basic/modal/SlideUpModal.vue";

// ** Props **
const props = defineProps({
  selectedParking: {
    type: Object as PropType<any>,
    default: null,
  },
  showChevron: {
    type: Boolean,
    default: false,
  },
});

// ** Data **
const addingPrice = ref<boolean>(false);

// ** Methods **
const openDirections = (): void => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${props.selectedParking.formattedAddress}`,
  );
};
</script>

<style lang="scss" scoped>
.map-selected {
  padding: 15px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    display: grid;
    align-items: center;
    grid-template-columns: 30px 1fr 30px;
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
