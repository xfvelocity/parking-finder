import type { UserStore } from "@/types/user.types";

import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: (): UserStore => ({
    currentLocation: {
      name: "",
      position: {
        lat: 0,
        lng: 0,
      },
    },
  }),
  persist: true,
});
