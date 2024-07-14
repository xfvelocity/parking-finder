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
      <Select label="Pub" autocomplete />

      <div v-if="pints.length" class="add-location-pints">
        <div
          v-for="(pint, i) in pints"
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

import { IonHeader, IonToolbar } from "@ionic/vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";
import Select from "@/components/basic/inputs/Select.vue";
import Icon from "@/components/basic/icon/Icon.vue";

// ** Emits **
defineEmits(["close"]);

// ** Data **
const pints = ref<any[]>([]);

// ** Methods **
const addPint = (): void => {
  pints.value.push({
    name: "",
    price: 0,
  });
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
