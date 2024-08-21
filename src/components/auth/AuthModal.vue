<template>
  <IonModal
    class="auth-modal"
    :is-open="modelValue"
    @did-dismiss="$emit('update:modelValue', false)"
  >
    <IonContent>
      <div class="auth-modal-content p-4 center">
        <Login
          v-if="authType === AUTH_TYPE.LOGIN"
          @change="authType = AUTH_TYPE.REGISTER"
          @login="handleResults"
        />

        <Register
          v-if="authType === AUTH_TYPE.REGISTER"
          @change="authType = AUTH_TYPE.LOGIN"
          @register="handleResults"
        />

        <EmailVerification
          v-if="authType === AUTH_TYPE.EMAIL_SENT"
          @verified="handleResults"
        />
      </div>
    </IonContent>
  </IonModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { AUTH_TYPE } from "@/content/enums";

import { IonModal, IonContent } from "@ionic/vue";
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import EmailVerification from "@/components/auth/EmailVerification.vue";

// ** Props **
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "login:success"]);

// ** Data **
const authType = ref<string>(AUTH_TYPE.LOGIN);

// ** Methods **
const handleResults = (result: any): void => {
  if (!result.emailVerified) {
    authType.value = AUTH_TYPE.EMAIL_SENT;
  } else {
    emits("login:success");
    emits("update:modelValue", false);
  }
};
</script>

<style lang="scss" scoped>
.auth-modal {
  --height: auto;

  &-content {
    width: 300px;
  }

  &::part(content) {
    height: 400px;
    width: 90%;
    border-radius: 10px;
  }
}
</style>
