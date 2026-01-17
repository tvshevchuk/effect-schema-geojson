import { Schema } from "effect";
import { BasicGeometry } from "./BasicGeometry.ts";
import { GeometryCollection } from "./GeometryCollection.ts";

export const Geometry = Schema.Union(
  BasicGeometry,
  GeometryCollection,
).annotations({
  description: "Any GeoJSON geometry",
});

export type Geometry = typeof Geometry.Type;

export const parseGeometry = Schema.decodeUnknown(Geometry);

export const isValidGeometry = Schema.is(Geometry);

export const encodeGeometry = Schema.encode(Geometry);
