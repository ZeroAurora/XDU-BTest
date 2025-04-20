import ky from "ky";

import { QW_API_HOST, QW_API_KEY } from "$env/static/private";

export const qweather = ky.create({
  prefixUrl: QW_API_HOST,
  headers: {
    "X-QW-Api-Key": QW_API_KEY,
  }
})
