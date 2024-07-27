<template>
  <IonButton class="button" size="small">
    <Icon v-if="icon" :src="icon" />

    <slot />
  </IonButton>
</template>

<script lang="ts" setup>
import { IonButton } from "@ionic/vue";
import Icon from "@/components/basic/icon/Icon.vue";

// ** Props **
defineProps({
  icon: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
  --background: #{$primary};

  .icon {
    margin-right: 5px;
  }
}
</style>
