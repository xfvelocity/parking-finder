<template>
  <IonMenu menu-id="sideMenu" :content-id="contentId">
    <IonContent>
      <div class="side-menu safe-area-top">
        <div class="side-menu-user mt-4 hover" @click="handleUserClick">
          <Icon class="mr-2" src="user" :size="28" />

          <p v-if="loggedIn">Hello, {{ user.name }}</p>
          <p v-else>Sign In</p>
        </div>

        <div
          v-for="(option, i) in options"
          :key="i"
          class="side-menu-option hover"
          :class="{
            'side-menu-option-selected': isCurrentRoute(option.routeName),
          }"
          @click="goToOption(option.routeName)"
        >
          <p>{{ option.text }}</p>

          <Icon
            v-if="!isCurrentRoute(option.routeName)"
            class="ml-auto"
            src="chevron-right"
          />
        </div>

        <div class="mt-auto safe-area-bottom">
          <div class="side-menu-option hover">
            <a
              href="mailto:contact@parkingfinder.uk?subject=Bug Report"
              target="_blank"
            >
              Report a bug
            </a>

            <Icon class="ml-auto" src="send" fill="grey-darken-1" />
          </div>

          <div class="side-menu-option hover">
            <a
              href="mailto:contact@parkingfinder.uk?subject=Feature Request"
              target="_blank"
            >
              Request a feature
            </a>

            <Icon class="ml-auto" src="send" fill="grey-darken-1" />
          </div>

          <div v-if="loggedIn" class="side-menu-option" @click="logOut">
            <p>Log out</p>

            <Icon class="ml-auto" src="signout" fill="grey-darken-1" />
          </div>
        </div>
      </div>
    </IonContent>
  </IonMenu>

  <AuthModal v-model="isAuthModalOpen" />
</template>

<script lang="ts" setup>
import type { SideMenuOption } from "@/types/app.types";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useConfigStore } from "@/stores/config";

import { IonMenu, IonContent } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Icon from "@/components/basic/icon/Icon.vue";
import AuthModal from "@/components/auth/AuthModal.vue";

// ** Props **
defineProps({
  contentId: {
    type: String,
    default: "main",
  },
});

// ** Data **
const userStore = useUserStore();
const configStore = useConfigStore();
const router = useRouter();
const route = useRoute();

const { user, loggedIn } = storeToRefs(userStore);
const isAuthModalOpen = ref<boolean>(false);
const options: SideMenuOption[] = [
  {
    text: "Home",
    routeName: "Home",
  },
];

// ** Methods **
const handleUserClick = (): void => {
  if (!loggedIn.value) {
    isAuthModalOpen.value = true;
  }
};

const goToOption = (routeName: string): void => {
  if (!isCurrentRoute(routeName)) {
    router.push(routeName);
  }
};

const logOut = (): void => {
  userStore.logout();

  configStore.snackbar = {
    text: "Successfully logged out",
    background: "primary",
  };
};

const isCurrentRoute = (routeName: string): boolean => {
  return routeName === route.name;
};
</script>

<style lang="scss" scoped>
.side-menu {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-user {
    background: map-get($colours, "background");
    padding: 15px;
    display: flex;
    align-items: center;
    border-top: 1px solid map-get($colours, "border");
  }

  &-option {
    padding: 15px;
    display: flex;
    align-items: center;
    border-top: 1px solid map-get($colours, "border");

    &-selected {
      p {
        color: map-get($colours, "primary");
      }
    }
  }
}
</style>
