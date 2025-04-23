import type { KVNamespace } from "@cloudflare/workers-types";
import type { AirQurality, Location } from "./types";

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
    return (await this.api
      .get("geo/v2/city/lookup", {
        searchParams: {
          location: keyword,
          range: "cn",
        },
      })
      .json()) as Location;
  }
  
  public async getAirQuality(locationId: string) {
    const cached = await this.KV.get(locationId);
    if (cached) {
      return JSON.parse(cached) as AirQurality;
    }

    // If not found in KV, fetch from API
    const aqData = await this.api
      .get("v7/air/now", {
        searchParams: {
          location: locationId,
        },
      })
      .text()
    
    await this.KV.put(`${locationId}:aqdata`, aqData, {
      expirationTtl: 1800, // 30 minutes
    });

    return JSON.parse(aqData) as AirQurality;
  }

  public async clearCache(locationId: string) {
    await this.KV.delete(`${locationId}:aqdata`);
  }
}
