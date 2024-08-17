<template>
  <IonModal
    :is-open="true"
    :initial-breakpoint="0.06"
    :breakpoints="[0.06, 0.95]"
    :backdrop-breakpoint="0.9"
    :backdrop-dismiss="false"
  >
    <IonHeader>
      <div class="map-list-header pt-4 pb-3">
        <h4 class="text-center">{{ items.length }} Parking Locations</h4>
      </div>
    </IonHeader>

    <IonContent>
      <div class="map-list p-2 pb-10">
        <LoadingSpinner v-if="loading" />

        <div
          v-for="(item, i) in items"
          :key="i"
          class="map-list-item bg-background mb-2 p-2 hover"
          @click="$emit('selected:item', item)"
        >
          <div class="map-list-item-header">
            <h5 class="mr-1">{{ item.name }}</h5>
            <Rating :rating="item.rating" :size="8" />
          </div>

          <p class="text-ellipsis">{{ item.address }}</p>
        </div>
      </div>
    </IonContent>
  </IonModal>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";

import { IonModal, IonContent, IonHeader } from "@ionic/vue";
import Rating from "@/components/basic/rating/Rating.vue";
import LoadingSpinner from "@/components/basic/loading/LoadingSpinner.vue";

// ** Props **
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Object as PropType<any[]>,
    default: () => [],
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "selected:item"]);

// ** Data **
const mapStore = useMapStore();

const { loading } = storeToRefs(mapStore);
</script>

<style lang="scss" scoped>
.map-list {
  &-header {
    border-bottom: 1px solid map-get($colours, "border");

    h4 {
      font-size: 14px;
    }
  }

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
