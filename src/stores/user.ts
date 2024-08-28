import type { ApiLoginSuccess } from "@/types/api.types";
import type { UserStore } from "@/types/user.types";

import { defineStore, getActivePinia } from "pinia";

export const useUserStore = defineStore("user", {
  state: (): UserStore => ({
    accessToken: "",
    user: {
      uuid: "",
      name: "",
      email: "",
      emailVerified: false,
    },
    currentLocation: {
      name: "",
      position: {
        lat: 0,
        lng: 0,
      },
    },
  }),
  getters: {
    loggedIn(): boolean {
      return !!this.accessToken;
    },
  },
  actions: {
    logout(): void {
      (getActivePinia() as any)?._s?.forEach((store: any) => store.$reset());
    },
    setLoggedInUser(response: ApiLoginSuccess): void {
      this.accessToken = response?.accessToken || "";

      this.user = {
        uuid: response?.uuid || "",
        name: response?.name || "",
        email: response?.email || "",
        emailVerified: response?.emailVerified || false,
      };
    },
  },
  persist: true,
});
