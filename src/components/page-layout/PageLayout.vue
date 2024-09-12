<template>
  <IonPage>
    <slot name="header" />

    <IonContent :id="contentId" :force-overscroll="false">
      <slot />
    </IonContent>

    <!-- <Footer /> -->
  </IonPage>

  <SideMenu :content-id="contentId" />

  <teleport to="ion-app">
    <Snackbar />
  </teleport>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";

import Footer from "@/components/footer/Footer.vue";
import Snackbar from "@/components/basic/snackbar/Snackbar.vue";
import SideMenu from "@/components/side-menu/SideMenu.vue";

// ** Props **
defineProps({
  contentId: {
    type: String,
    required: true,
  },
});
</script>
