<template>
  <div class="map-selected">
    <div class="map-selected-header">
      <Icon src="chevron-left" fill="grey" />

      <h4>{{ selectedParking.displayName.text }}</h4>
    </div>

    <hr class="divider" />

    <div v-if="selectedParking.prices" class="map-selected-parking">
      <h5>Prices</h5>
      <ul>
        <li v-for="(price, i) in selectedParking.prices" :key="i">
          <div>{{ price.hours }} hours</div>

          <div>£{{ price.price.toFixed(2) }}</div>
        </li>
      </ul>
    </div>

    <hr class="divider" />

    <div class="map-selected-info">
      <h5>Info</h5>
    </div>

    <a
      :href="`https://www.google.com/maps/dir/?api=1&destination=${selectedParking.formattedAddress}`"
    >
      <Button icon="directions"> Directions </Button>
    </a>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import Icon from "@/components/basic/icon/Icon.vue";
import Button from "@/components/basic/button/Button.vue";

// ** Props **
defineProps({
  selectedParking: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
});
</script>

<style lang="scss" scoped>
.map-selected {
  margin-top: 10px;
  padding: 5px 20px;

  &-header {
    display: grid;
    align-items: center;
    grid-template-columns: 30px 1fr 30px;
  }

  &-info {
    margin-bottom: 10px;
  }

  h4 {
    font-size: 14px;
    text-align: center;
  }

  h5 {
    font-size: 14px;
  }

  &-price {
    margin-left: auto;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      margin-top: 5px;
    }
  }
}
</style>
