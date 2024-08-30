<template>
  <IonModal
    class="map-selected"
    :is-open="!!selectedParking"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    handle
    @ion-breakpoint-did-change="$emit('update:selectedParking', null)"
  >
    <IonHeader>
      <div v-if="selectedParking" class="map-selected-header pt-5 pb-3">
        <h3>{{ selectedParking.name }}</h3>

        <Rating
          v-if="selectedParking.rating && !addingInfo"
          class="mt-1 mx-auto"
          :rating="selectedParking.rating"
        />
      </div>
    </IonHeader>

    <IonContent>
      <MapSelectedAddInfo v-if="addingInfo" />
      <MapSelectedInfo
        v-else
        :selected-parking="selectedParking"
        @open:authModal="isAuthModalOpen = $event"
        @update:addingInfo="addingInfo = $event"
      />
    </IonContent>

    <IonFooter v-if="addingInfo">
      <div class="map-selected-button p-4 safe-area-bottom">
        <CustomButton> Next </CustomButton>
      </div>
    </IonFooter>

    <IonFooter v-else>
      <div class="map-selected-button p-4 safe-area-bottom">
        <CustomButton icon="directions" @click="openDirections">
          Directions
        </CustomButton>
      </div>
    </IonFooter>
  </IonModal>

  <AuthModal v-model="isAuthModalOpen" @login:success="addingInfo = true" />
</template>

<script lang="ts" setup>
import type { Parking } from "@/types/map.types";
import type { PropType } from "vue";

import { ref } from "vue";

import { IonModal, IonContent, IonHeader, IonFooter } from "@ionic/vue";
import CustomButton from "@/components/basic/button/CustomButton.vue";
import MapSelectedInfo from "@/components/map/MapSelectedInfo.vue";
import MapSelectedAddInfo from "@/components/map/MapSelectedAddInfo.vue";
import Rating from "@/components/basic/rating/Rating.vue";
import AuthModal from "@/components/auth/AuthModal.vue";

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
const addingInfo = ref<boolean>(false);
const isAuthModalOpen = ref<boolean>(false);

// ** Methods **
const openDirections = (): void => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${props.selectedParking?.address}`
  );
};
</script>

<style lang="scss" scoped>
.map-selected {
  &-header {
    border-bottom: 1px solid map-get($colours, "border");
  }

  &-button {
    border-top: 1px solid map-get($colours, "border");
  }

  h3 {
    grid-column-start: 2;
    text-align: center;
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
}
</style>
