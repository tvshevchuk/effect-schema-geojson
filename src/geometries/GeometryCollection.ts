import { Schema } from "effect";
import { BoundingBox } from "../primitives/index.ts";
import { Geometry } from "./Geometry.ts";

// Declare the schema with proper lazy loading
export const GeometryCollection = Schema.Struct({
  type: Schema.Literal("GeometryCollection"),
  geometries: Schema.Array(Geometry),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A collection of geometry objects",
});

export type GeometryCollection = typeof GeometryCollection.Type;
