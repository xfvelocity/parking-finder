import axios from "axios";

export const searchLocation = async (value: string): Promise<any> => {
  const res = await axios.get(
    `https://geocode.search.hereapi.com/v1/geocode?q=${value}&in=countryCode:GBR&apiKey=${import.meta.env.VITE_MAPS_API_KEY}`
  );

  return res?.data?.items.map((item: any) => ({
    text: item.title,
    value: item.position,
  }));
};
