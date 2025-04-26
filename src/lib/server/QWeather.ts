import type { KVNamespace } from "@cloudflare/workers-types";
import type { AirQurality, Location, Weather } from "../types";

import ky from "ky";

import { QW_API_HOST, QW_API_KEY } from "$env/static/private";

export class QWeather {
  private api: typeof ky;
  private KV: KVNamespace;

  public constructor(fetch: typeof globalThis.fetch, platform: App.Platform) {
    if (!platform.env) {
      throw new Error("CloudFlare bindings not found");
    }

    this.KV = platform.env.KV;
    this.api = ky.create({
      prefixUrl: QW_API_HOST,
      headers: {
        "X-QW-Api-Key": QW_API_KEY,
      },
      fetch,
    });
  }

  public async searchLocation(keyword: string) {
    const resp = await this.api.get("geo/v2/city/lookup", {
      searchParams: {
        location: keyword,
        range: "cn",
      },
      throwHttpErrors: false,
    });

    if (resp.status === 404) return null;
    else return (await resp.json()) as Location;
  }

  private async fetchCachedData<T>(
    endpoint: string,
    locationId: string,
    cacheKey: string,
    expirationTtl: number,
  ): Promise<T> {
    const cached = await this.KV.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    // If not found in KV, fetch from API
    const data = await this.api
      .get(endpoint, {
        searchParams: {
          location: locationId,
        },
      })
      .text();

    await this.KV.put(cacheKey, data, {
      expirationTtl,
    });

    return JSON.parse(data) as T;
  }

  public async getWeather(locationId: string) {
    return this.fetchCachedData<Weather>(
      "v7/weather/now",
      locationId,
      `${locationId}:weather`,
      600, // 10 minutes
    );
  }

  public async getAirQuality(locationId: string) {
    return this.fetchCachedData<AirQurality>(
      "v7/air/now",
      locationId,
      `${locationId}:aqdata`,
      1800, // 30 minutes
    );
  }

  public async clearCache(locationId: string) {
    await this.KV.delete(`${locationId}:weather`);
    await this.KV.delete(`${locationId}:aqdata`);
  }
}
