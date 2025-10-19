import { Schema } from "effect";
import { BoundingBox, Position } from "../primitives/index.ts";

export const Point = Schema.Struct({
  type: Schema.Literal("Point"),
  coordinates: Position,
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A Point geometry",
});

export type Point = typeof Point.Type;

export const parsePoint = Schema.decodeUnknown(Point);

export const isValidPoint = Schema.is(Point);
