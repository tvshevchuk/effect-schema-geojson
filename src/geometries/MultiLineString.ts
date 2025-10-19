import { Schema } from "effect";
import { BoundingBox, Position } from "../primitives/index.ts";

export const MultiLineString = Schema.Struct({
  type: Schema.Literal("MultiLineString"),
  coordinates: Schema.Array(Schema.Array(Position).pipe(Schema.minItems(2))),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A MultiLineString geometry",
});

export type MultiLineString = typeof MultiLineString.Type;
