import { Schema } from "effect";
import { Feature, FeatureCollection } from "./features/index.ts";
import { Geometry } from "./geometries/index.ts";

export const GeoJSON = Schema.Union(
  Geometry,
  Feature,
  FeatureCollection,
).annotations({
  description: "Any valid GeoJSON object",
});

export type GeoJSON = typeof GeoJSON.Type;

export const parseGeoJSON = Schema.decodeUnknown(GeoJSON);

export const isValidGeoJSON = Schema.is(GeoJSON);

export const encodeGeoJSON = Schema.encode(GeoJSON);
