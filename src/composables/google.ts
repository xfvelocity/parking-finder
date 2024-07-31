import { useScriptTag } from "@vueuse/core";

export const initGoogle = async (): Promise<boolean> => {
  if (!window.google) {
    const { scriptTag, load } = useScriptTag(
      `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&callback=Function.prototype&libraries=places,geometry,marker`,
      () => true,
      {
        manual: true,
        async: true,
        defer: true,
      },
    );
    await load();

    return !!scriptTag;
  } else {
    return true;
  }
};
