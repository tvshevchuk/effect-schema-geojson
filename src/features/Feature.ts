import { Schema } from "effect";
import { Geometry } from "../geometries/index.ts";
import { BoundingBox } from "../primitives/index.ts";

export const Feature = Schema.Struct({
  type: Schema.Literal("Feature"),
  geometry: Schema.Union(Geometry, Schema.Null),
  properties: Schema.Union(
    Schema.Record({ key: Schema.String, value: Schema.Unknown }),
    Schema.Null,
  ),
  id: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A GeoJSON feature",
});

export type Feature = typeof Feature.Type;

export const parseFeature = Schema.decodeUnknown(Feature);

export const isValidFeature = Schema.is(Feature);

export const encodeFeature = Schema.encode(Feature);
