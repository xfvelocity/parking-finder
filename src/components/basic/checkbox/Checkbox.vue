<template>
  <ion-checkbox mode="md" />
</template>

<script lang="ts" setup>
import { IonCheckbox } from "@ionic/vue";
</script>

<style lang="scss">
@use "sass:map";
@use "@/theme/variables/_colours";

ion-checkbox {
  --border-width: 1px;
  --border-color: #{map.get(colours.$colours, "grey-lighten-1")};
}
</style>
