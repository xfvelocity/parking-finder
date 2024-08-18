<template>
  <div class="register p-4">
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
  </div>
</template>

<script lang="ts" setup>
import type { RegisterForm } from "@/types/user.types";

import { ref } from "vue";
import { api } from "@/api/api";

import CustomButton from "@/components/basic/button/CustomButton.vue";
import TextInput from "@/components/basic/inputs/TextInput.vue";

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

    console.log("success");
  }
};
</script>

<style lang="scss" scoped>
.register {
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
