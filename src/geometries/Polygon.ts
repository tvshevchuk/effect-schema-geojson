import { Schema } from "effect";
import { BoundingBox, LinearRing } from "../primitives/index.ts";

export const Polygon = Schema.Struct({
  type: Schema.Literal("Polygon"),
  coordinates: Schema.Array(LinearRing).pipe(Schema.minItems(1)),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A Polygon geometry",
});

export type Polygon = typeof Polygon.Type;

export const parsePolygon = Schema.decodeUnknown(Polygon);

export const isValidPolygon = Schema.is(Polygon);
