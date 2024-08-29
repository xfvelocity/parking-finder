<template>
  <div class="email-verification text-center">
    <h2 class="mb-1">Email sent!</h2>
    <p>A verification link has been sent to your email</p>

    <input
      id="codeInput"
      class="my-4"
      :value="code"
      maxlength="5"
      @keydown.enter="loading ? '' : submitCode"
      @input="code = ($event.target as any)?.value || ''"
    />

    <CustomButton :loading="loading" :height="35" @click="submitCode">
      Submit
    </CustomButton>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { api } from "@/api/api";

import CustomButton from "@/components/basic/button/CustomButton.vue";

// ** Emits **
const emits = defineEmits(["verified"]);

// ** Data **
const userStore = useUserStore();

const code = ref<string>("");
const loading = ref<boolean>(false);

// ** Methods **
const submitCode = async (): Promise<void> => {
  loading.value = true;

  const res = await api("POST", "email-verify", {
    code: parseInt(code.value),
    uuid: userStore.user.uuid,
  });

  if (res?.data?.accessToken) {
    userStore.setLoggedInUser(res?.data);

    emits("verified", res?.data);
  } else {
    code.value = "";
  }

  loading.value = false;
};

onMounted(() => {
  setTimeout(() => {
    document.getElementById("codeInput")?.focus();
  }, 200);
});
</script>

<style lang="scss" scoped>
.email-verification {
  input {
    background: none;
    border: none;
    border-bottom: 1px solid map-get($colours, "grey-lighten-1");
    width: 110px;
    height: 40px;
    text-align: center;
    outline: none;

    &:focus {
      border-width: 2px;
    }
  }
}
</style>
