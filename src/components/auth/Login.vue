<template>
  <div class="login text-center p-4">
    <h2>Login</h2>
    <p class="login-desc mt-1 mb-3">
      Please login to your account to add info to a parking location.
    </p>

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

      <CustomButton type="submit" :height="35" :loading="loading">
        Login
      </CustomButton>
    </form>

    <p class="mt-4">
      Haven't got an account?
      <span class="text-primary text-underline hover" @click="$emit('change')">
        Sign up
      </span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { LoginForm } from "@/types/user.types";

import { ref } from "vue";
import { api } from "@/api/api";
import { useUserStore } from "@/stores/user";

import CustomButton from "@/components/basic/button/CustomButton.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";

// ** Emits **
const emits = defineEmits(["change", "login"]);

// ** Data **
const userStore = useUserStore();

const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);
const loginForm = ref<LoginForm>({
  email: "",
  password: "",
});

// ** Methods **
const login = async (e: any): Promise<void> => {
  e.preventDefault();

  loading.value = true;

  const res = await api("POST", "login", loginForm.value);

  if (!res?.error) {
    loginForm.value = {
      email: "",
      password: "",
    };

    if (res?.data?.emailVerified) {
      userStore.setLoggedInUser(res?.data);
    }

    emits("login", res?.data);
  }

  loading.value = false;
};
</script>

<style lang="scss" scoped>
.login {
  &-desc {
    max-width: 200px;
    margin: 0 auto;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
