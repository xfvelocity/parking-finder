<template>
  <DragModal :is-open="modelValue">
    <template #header>
      <h4 class="text-center">{{ items.length }} Parking Locations</h4>
    </template>

    <div class="map-list p-4 pb-10">
      <LoadingSpinner v-if="loading" class="my-2" :size="24" />

      <template v-else>
        <div
          v-for="(item, i) in items"
          :key="i"
          class="map-list-item bg-background mb-2 p-3 hover"
          @click="$emit('selected:item', item)"
        >
          <div class="map-list-item-header">
            <h5 class="mr-1">{{ item.name }}</h5>
            <Rating v-if="item.rating" :rating="item.rating" :size="8" />
          </div>

          <p>{{ distanceFromCurrentLocation(item) }}</p>
        </div>
      </template>
    </div>
  </DragModal>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

import Rating from "@/components/basic/rating/Rating.vue";
import LoadingSpinner from "@/components/basic/loading/LoadingSpinner.vue";
import DragModal from "@/components/basic/modal/DragModal.vue";

// ** Props **
defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  items: {
    type: Object as PropType<any[]>,
    default: () => [],
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "selected:item"]);

// ** Data **
const userStore = useUserStore();
const mapStore = useMapStore();

const { loading } = storeToRefs(mapStore);

const distanceFromCurrentLocation = (item: any): string | null => {
  if (userStore.currentLocation.name) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      userStore.currentLocation.position,
      {
        lng: item.location.coordinates[0],
        lat: item.location.coordinates[1],
      }
    );

    return `${(distance / 1000).toFixed(1)}km away`;
  } else {
    return null;
  }
};
</script>

<style lang="scss" scoped>
h4 {
  font-size: 14px;
}

.map-list {
  &-item {
    border-radius: 10px;

    &-header {
      display: flex;
      align-items: center;
    }

    h5 {
      font-size: 12px;
    }
  }
}
</style>
