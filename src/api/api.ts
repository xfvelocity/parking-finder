import { useConfigStore } from "@/stores/config";
import { useUserStore } from "@/stores/user";
import axios from "axios";

export const api = async <T = any>(
  method: string,
  url: string,
  data: any = {},
): Promise<T> => {
  let res: any;
  let config: any = {};

  const configStore = useConfigStore();
  const userStore = useUserStore();

  try {
    config = {
      headers: {
        accept: "application/json",
        Authorization: `${userStore.accessToken || ""}`,
      },
    };

    if (method === "GET") {
      res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${url}`,
        config,
      );
    } else if (method === "POST") {
      res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/${url}`,
        data,
        config,
      );
    }

    if (res?.status !== 200) {
      throw new Error((res?.response || res).data || "Something went wrong");
    }
  } catch (e: any) {
    console.error(e);

    configStore.snackbar = {
      text: e?.response?.data?.message || e,
      icon: "exclamation",
      background: "red-darken-2",
    };

    res = { error: e?.response?.data || e };
  }

  return res;
};
