import type { Actions, PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";

import { QWeather } from "$lib/server/QWeather";

export const load: PageServerLoad = async ({ fetch, params, platform }) => {
  const locationId = params.locationId;

  if (!platform) {
    throw new Error("Platform is not defined");
  }
  const qweather = new QWeather(fetch, platform);

  const location = await qweather.searchLocation(locationId);
  if (!location) error(404, "Location not found");

  return {
    location: location.location[0],
    airQuality: await qweather.getAirQuality(locationId),
  };
};

export const actions = {
  clearCache: async ({ fetch, params, platform }) => {
    const locationId = params.locationId;

    if (!platform) {
      throw new Error("Platform is not defined");
    }
    const qweather = new QWeather(fetch, platform);
    await qweather.clearCache(locationId);

    return {
      cleared: true,
    };
  },
} satisfies Actions;
