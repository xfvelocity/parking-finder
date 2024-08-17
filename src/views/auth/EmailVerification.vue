<template></template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// ** Data **
const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

// ** Methods **
const verifyEmail = async (): Promise<void> => {
  const { code, uuid } = route.query;

  if (code && uuid) {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/email-verify`,
      {
        code,
        uuid,
      }
    );

    if (res?.data?.accessToken) {
      userStore.accessToken = res?.data?.accessToken;
      delete res?.data?.accessToken;

      userStore.user = { ...res?.data };
    }
  }

  await router.push({ name: "Home" });
};

watch(route, verifyEmail, { immediate: true });
</script>
