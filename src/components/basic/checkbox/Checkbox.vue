<template>
  <ion-checkbox mode="md" />
</template>

<script lang="ts" setup>
import { IonCheckbox } from "@ionic/vue";
</script>

<style lang="scss">
ion-checkbox {
  --border-width: 1px;
  --border-color: #{map-get($colours, "grey-lighten-1")};
}
</style>
