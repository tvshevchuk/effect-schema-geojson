import { Schema } from "effect";
import { BoundingBox, Position } from "../primitives/index.ts";

export const MultiPoint = Schema.Struct({
  type: Schema.Literal("MultiPoint"),
  coordinates: Schema.Array(Position),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A MultiPoint geometry",
});

export type MultiPoint = typeof MultiPoint.Type;
