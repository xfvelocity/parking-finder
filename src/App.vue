<template>
  <IonApp
    :class="{
      ios: isPlatform('ios'),
      android: isPlatform('android'),
      web: !isPlatform('hybrid'),
    }"
  >
    <IonRouterOutlet />
  </IonApp>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from "@ionic/vue";
</script>

<style lang="scss">
body {
  background: rgb(44, 44, 44) !important;
}
</style>
