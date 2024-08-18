import type { ApiLoginSuccess } from "@/types/api.types";
import type { UserStore } from "@/types/user.types";

import { defineStore } from "pinia";

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
  actions: {
    setLoggedInUser(response: ApiLoginSuccess): void {
      this.accessToken = response.accessToken;
      this.user = {
        uuid: response.uuid,
        name: response.name,
        email: response.email,
        emailVerified: true,
      };
    },
  },
  persist: true,
});
