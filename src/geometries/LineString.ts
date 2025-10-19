import { Schema } from "effect";
import { BoundingBox, Position } from "../primitives/index.ts";

export const LineString = Schema.Struct({
  type: Schema.Literal("LineString"),
  coordinates: Schema.Array(Position).pipe(Schema.minItems(2)),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A LineString geometry",
});

export type LineString = typeof LineString.Type;

export const parseLineString = Schema.decodeUnknown(LineString);

export const isValidLineString = Schema.is(LineString);
