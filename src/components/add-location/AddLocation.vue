<template>
  <div class="add-location">
    <IonHeader>
      <IonToolbar>
        <div class="add-location-header">
          <Icon
            class="hover"
            src="chevron-left"
            :size="14"
            fill="blue"
            @click="$emit('close')"
          />

          <h5>Add Location</h5>
        </div>
      </IonToolbar>
    </IonHeader>

    <div class="add-location-content">
      <Select
        v-model="location.pub"
        label="Pub"
        placeholder="Search for a pub"
        :outside-request="findPub"
        autocomplete
      />

      <div v-if="location.pints.length" class="add-location-pints">
        <div
          v-for="(pint, i) in location.pints"
          :key="i"
          class="add-location-pints-item"
        >
          <TextInput label="Beer" v-model="pint.name" />
          <TextInput label="Price" v-model="pint.price" />
        </div>
      </div>

      <div class="add-location-pints-add hover" @click="addPint">
        <Icon src="plus" fill="blue" />

        <p>Add pint</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useMapStore } from "@/stores/map";

import { IonHeader, IonToolbar } from "@ionic/vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";
import Select from "@/components/basic/inputs/Select.vue";
import Icon from "@/components/basic/icon/Icon.vue";
import axios from "axios";

// ** Emits **
defineEmits(["close"]);

// ** Data **
const mapStore = useMapStore();

const location = ref<any>({
  name: "",
  pints: [],
});

// ** Methods **
const addPint = (): void => {
  location.value.pints.push({
    name: "",
    price: 0,
  });
};

const findPub = async (searchText: string): Promise<void> => {
  const { lat, lng } = mapStore.location.position;

  const res = await axios.get(
    `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=${searchText}&in=countryCode:GBR&apiKey=${import.meta.env.VITE_MAPS_API_KEY}`
  );

  return res?.data?.items?.map((item: any) => ({
    text: item.title,
    value: item.id,
  }));
};
</script>

<style lang="scss" scoped>
.add-location {
  &-content {
    padding: 10px;
    max-width: 300px;
    margin: 0 auto;
  }

  &-header {
    display: grid;
    width: 100%;
    grid-template-columns: 30px 1fr 30px;
    padding: 10px;

    h5 {
      margin: 0;
      text-align: center;
      font-size: 14px;
    }
  }

  &-pints {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid rgb(226, 226, 226);
    border-radius: 5px;

    &-add {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;

      p {
        margin-left: 5px;
      }
    }
  }
}
</style>
