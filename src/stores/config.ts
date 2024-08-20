import { defineStore } from "pinia";
import { ConfigStore } from "@/types/app.types";

export const useConfigStore = defineStore("config", {
  state: (): ConfigStore => ({
    snackbar: {
      text: "",
      icon: "",
      background: "",
    },
  }),
});
