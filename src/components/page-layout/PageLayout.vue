<template>
  <IonPage>
    <slot name="header" />

    <IonContent :force-overscroll="false">
      <slot />
    </IonContent>

    <!-- <Footer /> -->

    <Snackbar />
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";

import Footer from "@/components/footer/Footer.vue";
import Snackbar from "@/components/basic/snackbar/Snackbar.vue";
</script>
