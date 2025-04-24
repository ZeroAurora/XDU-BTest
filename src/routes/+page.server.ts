import type { Actions, PageServerLoad } from "./$types";

import { error, redirect } from "@sveltejs/kit";

import { QWeather } from "$lib/server/QWeather";

export const load: PageServerLoad = async ({ fetch, platform, url }) => {
  const locationId = url.searchParams.get("locationId");
  const defailtLocationId = "101110101"; // Xi'an
  if (!locationId)
    redirect(302, `?locationId=${defailtLocationId}`);

  if (!platform) {
    throw new Error("Platform is not defined");
  }
  const qweather = new QWeather(fetch, platform);

  const location = await qweather.searchLocation(locationId);
  if (!location.location || location.location.length === 0)
    error(404, "Location not found");

  return {
    location: location.location[0],
    airQuality: await qweather.getAirQuality(locationId),
  };
}

export const actions = {
  clearCache: async ({ fetch, platform, request }) => {
    const formData = await request.formData();
    const locationId = formData.get("locationId") as string;
    if (!locationId) {
      throw error(400, "Location ID is required");
    }

    if (!platform) {
      throw new Error("Platform is not defined");
    }
    const qweather = new QWeather(fetch, platform);
    await qweather.clearCache(locationId);

    return {
      cleared: true,
    };
  }
} satisfies Actions
