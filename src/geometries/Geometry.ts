import { Schema } from "effect";
import { GeometryCollection } from "./GeometryCollection.ts";
import { LineString } from "./LineString.ts";
import { MultiLineString } from "./MultiLineString.ts";
import { MultiPoint } from "./MultiPoint.ts";
import { MultiPolygon } from "./MultiPolygon.ts";
import { Point } from "./Point.ts";
import { Polygon } from "./Polygon.ts";

const BasicGeometry = Schema.Union(
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
);

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
