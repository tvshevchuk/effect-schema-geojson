import { Schema } from "effect";
import { BoundingBox } from "../primitives/index.ts";
import { LineString } from "./LineString.ts";
import { MultiLineString } from "./MultiLineString.ts";
import { MultiPoint } from "./MultiPoint.ts";
import { MultiPolygon } from "./MultiPolygon.ts";
import { Point } from "./Point.ts";
import { Polygon } from "./Polygon.ts";

// GeometryCollection can only contain basic geometries, not other GeometryCollections
const BasicGeometry = Schema.Union(
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
);

export const GeometryCollection = Schema.Struct({
  type: Schema.Literal("GeometryCollection"),
  geometries: Schema.Array(BasicGeometry),
  bbox: Schema.optional(BoundingBox),
}).annotations({
  description:
    "A collection of geometry objects (cannot contain other GeometryCollections)",
});

export type GeometryCollection = typeof GeometryCollection.Type;
