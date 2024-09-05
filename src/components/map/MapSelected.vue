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
          v-if="selectedParking.rating && !editingInfo"
          class="mt-1 mx-auto"
          :rating="selectedParking.rating"
        />
      </div>
    </IonHeader>

    <IonContent>
      <MapSelectedAddInfo
        v-if="editingInfo"
        :info-type="infoType"
        @update:info:disabled="addedInfoDisabled[infoType] = $event"
        @update:info:values="info = $event"
      />
      <MapSelectedInfo
        v-else
        :selected-parking="selectedParking"
        @open:authModal="isAuthModalOpen = $event"
        @update:addingInfo="infoType = INFO_TYPE.PRICE"
      />
    </IonContent>

    <IonFooter>
      <div id="addPriceScroller" />

      <div v-if="editingInfo" class="map-selected-button p-4 safe-area-bottom">
        <template v-if="infoType === INFO_TYPE.TIMES">
          <CustomButton :loading="submitLoading" @click="submitChanges">
            Submit
          </CustomButton>
        </template>
        <template v-else>
          <CustomButton outlined @click="nextEditScreen"> Skip </CustomButton>

          <CustomButton
            :disabled="addedInfoDisabled[infoType]"
            @click="nextEditScreen"
          >
            Next
          </CustomButton>
        </template>
      </div>

      <div v-else class="map-selected-button p-4 safe-area-bottom">
        <CustomButton icon="directions" @click="openDirections">
          Directions
        </CustomButton>
      </div>
    </IonFooter>
  </IonModal>

  <AuthModal
    v-model="isAuthModalOpen"
    @login:success="infoType = INFO_TYPE.PRICE"
  />
</template>

<script lang="ts" setup>
import type { NewParking, NewParkingTimes, Parking } from "@/types/map.types";
import type { PropType } from "vue";

import { computed, ref, watch } from "vue";
import { INFO_TYPE } from "@/content/enums";
import { api } from "@/api/api";
import { useConfigStore } from "@/stores/config";

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
const configStore = useConfigStore();

const isAuthModalOpen = ref<boolean>(false);
const infoType = ref<INFO_TYPE>(INFO_TYPE.VIEWING);
const info = ref<NewParking>();
const submitLoading = ref<boolean>(false);
const addedInfoDisabled = ref<any>({
  [INFO_TYPE.PRICE]: true,
  [INFO_TYPE.INFO]: true,
  [INFO_TYPE.TIMES]: true,
});

// ** Computed **
const editingInfo = computed<boolean>(() => {
  return infoType.value !== INFO_TYPE.VIEWING;
});

// ** Methods **
const submitChanges = async (): Promise<void> => {
  if (!info.value) {
    return;
  }

  submitLoading.value = true;

  const payload: NewParking = JSON.parse(JSON.stringify({ ...info.value }));

  Object.keys(payload.times).map((key) => {
    const time = payload.times[key as keyof NewParkingTimes];

    payload.times[key as keyof NewParkingTimes] = {
      openingTime: (time.openingTime as string[]).join(":"),
      closingTime: (time.closingTime as string[]).join(":"),
      isOpen: time.isOpen,
    };
  });

  const res = await api(
    "POST",
    `map/${props.selectedParking?.locationUuid}/info`,
    payload,
    true
  );

  if (!res?.error) {
    configStore.snackbar = {
      text: "Info has been submitted for review",
      background: "green",
    };

    infoType.value = INFO_TYPE.VIEWING;
    info.value = undefined;
    addedInfoDisabled.value = {
      [INFO_TYPE.PRICE]: true,
      [INFO_TYPE.INFO]: true,
      [INFO_TYPE.TIMES]: true,
    };
  }

  submitLoading.value = false;
};

const openDirections = (): void => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${props.selectedParking?.address}`
  );
};

const nextEditScreen = (): void => {
  if (infoType.value === INFO_TYPE.PRICE) {
    infoType.value = INFO_TYPE.INFO;
  } else if (infoType.value === INFO_TYPE.INFO) {
    infoType.value = INFO_TYPE.TIMES;
  } else if (infoType.value === INFO_TYPE.TIMES) {
    infoType.value = INFO_TYPE.SUBMIT;
  }
};

// ** Watchers **
watch(
  () => props.selectedParking,
  () => {
    if (!props.selectedParking) {
      infoType.value = INFO_TYPE.VIEWING;
      info.value = undefined;
      addedInfoDisabled.value = {
        [INFO_TYPE.PRICE]: true,
        [INFO_TYPE.INFO]: true,
        [INFO_TYPE.TIMES]: true,
      };
    }
  }
);
</script>

<style lang="scss" scoped>
.map-selected {
  &-header {
    border-bottom: 1px solid map-get($colours, "border");
  }

  &-button {
    display: flex;
    align-items: center;
    gap: 10px;
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
