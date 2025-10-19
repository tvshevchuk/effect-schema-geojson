import { Schema } from "effect";
import { BoundingBox } from "../primitives/index.ts";
import { Feature } from "./Feature.ts";

export const FeatureCollection = Schema.Struct({
  type: Schema.Literal("FeatureCollection"),
  features: Schema.Array(Feature),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A collection of GeoJSON features",
});

export type FeatureCollection = typeof FeatureCollection.Type;

export const parseFeatureCollection = Schema.decodeUnknown(FeatureCollection);

export const isValidFeatureCollection = Schema.is(FeatureCollection);

export const encodeFeatureCollection = Schema.encode(FeatureCollection);
