import { Schema } from "effect";
import { BoundingBox } from "../primitives/index.ts";
import { BasicGeometry } from "./BasicGeometry.ts";

export const Geometry: Schema.Schema<any, any, any> = Schema.suspend(() =>
  Schema.Union(BasicGeometry, GeometryCollection),
).annotations({
  description: "Any GeoJSON geometry",
});

export const GeometryCollection: Schema.Schema<any, any, any> = Schema.Struct({
  type: Schema.Literal("GeometryCollection"),
  geometries: Schema.Array(Geometry),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description: "A collection of geometry objects",
});

export type Geometry = typeof Geometry.Type;

export const parseGeometry = Schema.decodeUnknown(Geometry);

export const isValidGeometry = Schema.is(Geometry);

export const encodeGeometry = Schema.encode(Geometry);

export type GeometryCollection = typeof GeometryCollection.Type;

export const parseGeometryCollection = Schema.decodeUnknown(GeometryCollection);

export const isValidGeometryCollection = Schema.is(GeometryCollection);

export const encodeGeometryCollection = Schema.encode(GeometryCollection);
