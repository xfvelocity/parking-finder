<template></template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/api/api";

// ** Data **
const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

// ** Methods **
const verifyEmail = async (): Promise<void> => {
  const { code, uuid } = route.query;

  if (code && uuid) {
    const res = await api("POST", "email-verify", { code, uuid });

    if (res?.data?.accessToken) {
      userStore.accessToken = res?.data?.accessToken;
      delete res?.data?.accessToken;

      userStore.user = { ...res?.data };
    }
  }

  await router.push({ name: "Home" });
};

onMounted(verifyEmail);
</script>
