export interface Location {
  code: string;
  location: LocationInner[];
  refer: Refer;
}

export interface LocationInner {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
  tz: string;
  utcOffset: string;
  isDst: string;
  type: string;
  rank: string;
  fxLink: string;
}

export interface Refer {
  sources: string[];
  license: string[];
}
