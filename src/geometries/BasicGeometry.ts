import { Schema } from "effect";
import { LineString } from "./LineString.ts";
import { MultiLineString } from "./MultiLineString.ts";
import { MultiPoint } from "./MultiPoint.ts";
import { MultiPolygon } from "./MultiPolygon.ts";
import { Point } from "./Point.ts";
import { Polygon } from "./Polygon.ts";

/**
 * Union of all basic geometry types (excludes GeometryCollection).
 * Used by both GeometryCollection (for its geometries array) and Geometry (as part of the union).
 */
export const BasicGeometry = Schema.Union(
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
).annotations({
  description:
    "A basic GeoJSON geometry (Point, MultiPoint, LineString, MultiLineString, Polygon, or MultiPolygon)",
});

export type BasicGeometry = typeof BasicGeometry.Type;
