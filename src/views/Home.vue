<template>
  <PageLayout>
    <template #header>
      <IonHeader>
        <IonToolbar>
          <div class="home-header">
            <TextInput
              v-model="locationSearch"
              label="Location"
              placeholder="Search for a location"
              select-on-focus
              @update:modelValue="onLocationSearch"
            />

            <div v-if="mapResults.length" class="home-header-results">
              <ul>
                <li
                  v-for="(result, i) in mapResults"
                  :key="i"
                  class="hover"
                  @click="selectLocation(result)"
                >
                  {{ result.name }}
                </li>
              </ul>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
    </template>

    <Map :location="location.position" />

    <IonFab class="home-add-location" @click="addLocationModalOpen = true">
      <IonFabButton size="small">
        <Icon src="plus" fill="white" />
      </IonFabButton>
    </IonFab>

    <IonModal :is-open="addLocationModalOpen">
      <AddLocation @close="addLocationModalOpen = false" />
    </IonModal>
  </PageLayout>
</template>

<script lang="ts" setup>
import type { MapLocationResult } from "@/types/map.types";

import { IonHeader, IonToolbar } from "@ionic/vue";
import { ref } from "vue";
import { debounce } from "@/composables/generic";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import axios from "axios";

import { IonFab, IonFabButton, IonModal } from "@ionic/vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";
import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import AddLocation from "@/components/add-location/AddLocation.vue";

// ** Data **
const mapStore = useMapStore();

const { location } = storeToRefs(mapStore);

const locationSearch = ref<string>(location.value.name);
const mapResults = ref<MapLocationResult[]>([]);
const addLocationModalOpen = ref<boolean>(false);

// ** Methods **
const selectLocation = (result: MapLocationResult): void => {
  location.value = {
    name: result.name.split(",")[0],
    position: result.position,
  };

  locationSearch.value = location.value.name;
  mapResults.value = [];
};

const onLocationSearch = debounce(async (value: string): Promise<void> => {
  if (value.length > 2) {
    const res = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode?q=${value}&in=countryCode:GBR&apiKey=${import.meta.env.VITE_MAPS_API_KEY}`
    );

    mapResults.value = res?.data?.items.map((item: any) => ({
      name: item.title,
      position: item.position,
    }));
  }
}, 300);
</script>

<style lang="scss" scoped>
.home {
  &-header {
    padding: 15px;

    &-results {
      width: 100%;
      border-radius: 5px;
      padding: 7px 10px;
      border: 1px solid rgb(230, 230, 230);
      margin-top: 5px;

      ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          font-size: 12px;
          color: rgb(100, 100, 100);
          padding: 10px 0;

          &:last-child {
            padding-bottom: 10px;
          }

          &:not(:last-child) {
            border-bottom: 1px solid rgb(230, 230, 230);
          }
        }
      }
    }
  }

  &-add-location {
    position: absolute;
    z-index: 99;
    bottom: 10px;
    left: 10px;
  }
}
</style>
