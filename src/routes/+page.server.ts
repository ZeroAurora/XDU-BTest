import type { Actions, PageServerLoad } from "./$types";

import { error, redirect } from "@sveltejs/kit";

import { QWeather } from "$lib/server/QWeather";

export const load: PageServerLoad = async ({ depends, fetch, platform, url }) => {
  depends("app:refresh");

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

} satisfies Actions
