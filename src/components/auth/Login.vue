<template>
  <div class="login p-4">
    <form @submit="login">
      <TextInput
        v-model="loginForm.email"
        label="Email"
        type="email"
        name="Email"
        autocomplete="email"
        required
      />

      <TextInput
        v-model="loginForm.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        name="Password"
        autocomplete="current-password"
        :append-icon="showPassword ? 'eye' : 'eye-slash'"
        append-icon-colour="grey"
        required
        @click:append="showPassword = !showPassword"
      />

      <CustomButton type="submit"> Log in </CustomButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { LoginForm } from "@/types/user.types";

import { ref } from "vue";
import { api } from "@/api/api";
import { useUserStore } from "@/stores/user";

import CustomButton from "@/components/basic/button/CustomButton.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";

// ** Data **
const userStore = useUserStore();

const showPassword = ref<boolean>(false);
const loginForm = ref<LoginForm>({
  email: "",
  password: "",
});

// ** Methods **
const login = async (e: any): Promise<void> => {
  e.preventDefault();

  const res = await api("POST", "login", loginForm.value);

  if (!res?.error) {
    loginForm.value = {
      email: "",
      password: "",
    };

    if (res?.data?.emailVerified) {
      userStore.setLoggedInUser(res?.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
