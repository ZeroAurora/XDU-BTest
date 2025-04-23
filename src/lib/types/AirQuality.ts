export interface AirQurality {
  code: string;
  updateTime: string;
  fxLink: string;
  now: Now;
  station: Now[];
  refer: Refer;
}

export interface Now {
  pubTime: string; // ISO 8601
  aqi: string;
  level: string;
  category: string;
  primary: string;
  pm10: string;
  pm2p5: string;
  no2: string;
  so2: string;
  co: string;
  o3: string;
  name?: string;
  id?: string;
}

export interface Refer {
  sources: string[];
  license: string[];
}
