<template>
  <IonPage>
    <Navbar v-if="!$slots.header" />
    <slot v-else name="header" />

    <IonContent>
      <slot />
    </IonContent>

    <!-- <Footer /> -->
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";

import Navbar from "@/components/navbar/Navbar.vue";
import Footer from "@/components/footer/Footer.vue";
</script>
