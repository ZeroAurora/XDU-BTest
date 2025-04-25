import type { PageServerLoad } from "./$types";

import { QWeather } from "$lib/server/QWeather";

export const load: PageServerLoad = async ({ fetch, platform, url }) => {
  const search = url.searchParams.get("search");
  if (!search) {
    return {};
  }

  if (!platform) {
    throw new Error("Platform is not defined");
  }
  const qweather = new QWeather(fetch, platform);

  return {
    search,
    result: await qweather.searchLocation(search),
  };
};
