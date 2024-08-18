<template>
  <div class="register text-center p-4">
    <h5>Register</h5>
    <p class="register-desc mt-1 mb-3">
      Please register an account to add prices to a parking location.
    </p>

    <form @submit="register">
      <TextInput
        v-model="registerForm.name"
        label="Name"
        name="Name"
        autocomplete="name"
        required
      />

      <TextInput
        v-model="registerForm.email"
        label="Email"
        type="email"
        name="Email"
        autocomplete="email"
        required
      />

      <TextInput
        v-model="registerForm.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        name="Password"
        autocomplete="new-password"
        :append-icon="showPassword ? 'eye' : 'eye-slash'"
        append-icon-colour="grey"
        required
        @click:append="showPassword = !showPassword"
      />

      <CustomButton type="submit"> Register </CustomButton>
    </form>

    <p class="mt-4">
      Already got an account?
      <span class="text-primary text-underline hover" @click="$emit('change')">
        Login
      </span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { RegisterForm } from "@/types/user.types";

import { ref } from "vue";
import { api } from "@/api/api";

import CustomButton from "@/components/basic/button/CustomButton.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";

// ** Emits **
const emits = defineEmits(["change", "register"]);

// ** Data **
const showPassword = ref<boolean>(false);
const registerForm = ref<RegisterForm>({
  name: "",
  email: "",
  password: "",
});

// ** Methods **
const register = async (e: any): Promise<void> => {
  e.preventDefault();

  const res = await api("POST", "register", registerForm.value);

  if (!res?.error) {
    registerForm.value = {
      name: "",
      email: "",
      password: "",
    };

    emits("register", res?.data);
  }
};
</script>

<style lang="scss" scoped>
.register {
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
