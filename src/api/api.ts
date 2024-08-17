import { useUserStore } from "@/stores/user";
import axios from "axios";

export const api = async (
  method: string,
  url: string,
  data: any = {},
  auth: boolean = false
): Promise<any> => {
  let res: any;
  let config: any = {};

  try {
    if (auth) {
      const userStore = useUserStore();

      config = {
        headers: {
          accept: "application/json",
          Authorization: `${userStore.accessToken}`,
        },
      };
    }

    if (method === "GET") {
      res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${url}`,
        config
      );
    } else if (method === "POST") {
      res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/${url}`,
        data,
        config
      );
    }

    if (res?.status !== 200) {
      throw new Error((res?.response || res).data || "Something went wrong");
    }
  } catch (e) {
    console.error(e);

    // TODO: Add error handling
    return e;
  }

  return res;
};
