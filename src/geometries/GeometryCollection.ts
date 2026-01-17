import { Schema } from "effect";
import { BoundingBox } from "../primitives/index.ts";
import { BasicGeometry } from "./BasicGeometry.ts";

export const GeometryCollection = Schema.Struct({
  type: Schema.Literal("GeometryCollection"),
  geometries: Schema.Array(BasicGeometry),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description:
    "A collection of geometry objects (cannot contain other GeometryCollections)",
});

export type GeometryCollection = typeof GeometryCollection.Type;

export const parseGeometryCollection = Schema.decodeUnknown(GeometryCollection);

export const isValidGeometryCollection = Schema.is(GeometryCollection);

export const encodeGeometryCollection = Schema.encode(GeometryCollection);
