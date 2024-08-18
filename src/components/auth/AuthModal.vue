<template>
  <IonModal
    class="auth-modal"
    :is-open="true"
    @did-dismiss="$emit('update:modelValue', false)"
  >
    <IonContent>
      <div class="p-4">
        <Login
          v-if="isLogin"
          @change="isLogin = false"
          @login="handleResults"
        />
        <Register v-else @change="isLogin = true" @register="handleResults" />
      </div>
    </IonContent>
  </IonModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { IonModal, IonContent } from "@ionic/vue";
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";

// ** Props **
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// ** Emits **
defineEmits(["update:modelValue"]);

// ** Data **
const isLogin = ref<boolean>(false);

// ** Methods **
const handleResults = (result: any): void => {
  console.log(result);
};
</script>

<style lang="scss" scoped>
.auth-modal {
  &::part(content) {
    height: 400px;
    width: 90%;
    border-radius: 10px;
  }
}
</style>
