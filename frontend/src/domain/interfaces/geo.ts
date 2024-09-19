export interface GeoJSON {
  type: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<number[]>>;
}

export interface Properties {
  name: string;
  kato: number;
  x: number;
  y: number;
}
