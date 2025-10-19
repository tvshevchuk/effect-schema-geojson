import { Schema } from "effect";
import { BoundingBox, LinearRing } from "../primitives/index.ts";

export const MultiPolygon = Schema.Struct({
  type: Schema.Literal("MultiPolygon"),
  coordinates: Schema.Array(Schema.Array(LinearRing).pipe(Schema.minItems(1))),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A MultiPolygon geometry",
});

export type MultiPolygon = typeof MultiPolygon.Type;
