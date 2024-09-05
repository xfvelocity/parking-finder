<template>
  <IonApp :class="{ ios: isPlatform('ios'), android: isPlatform('android') }">
    <IonRouterOutlet />
  </IonApp>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from "@ionic/vue";
</script>
