<template>
  <PageLayout>
    <template #header>
      <IonHeader>
        <IonToolbar>
          <div class="home-header">
            <TextInput
              v-model="locationSearch"
              placeholder="Search for a location"
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

    <Map :location="mapLocation" />
  </PageLayout>
</template>

<script lang="ts" setup>
import type { MapLocation, MapLocationResult } from "@/types/app.types";

import { IonHeader, IonToolbar } from "@ionic/vue";
import { ref } from "vue";
import { debounce } from "@/composables/generic";
import axios from "axios";

import TextInput from "@/components/basic/inputs/TextInput.vue";
import PageLayout from "@/components/page-layout/PageLayout.vue";
import Map from "@/components/map/Map.vue";

// ** Data **
const locationSearch = ref<string>("");
const mapLocation = ref<MapLocation>({
  lat: 51.5072,
  lng: -0.1276,
});
const mapResults = ref<MapLocationResult[]>([]);

// ** Methods **
const selectLocation = (result: MapLocationResult): void => {
  mapLocation.value = result.location;
  locationSearch.value = "";
  mapResults.value = [];
};

const onLocationSearch = debounce(async (value: string): Promise<void> => {
  if (value.length > 2) {
    const res = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode?q=${value}&in=countryCode:GBR&apiKey=${import.meta.env.VITE_MAPS_API_KEY}`
    );

    mapResults.value = res?.data?.items.map((item: any) => ({
      name: item.title,
      location: item.position,
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
}
</style>
