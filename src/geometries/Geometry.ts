import { Schema } from "effect";
import { LineString } from "./LineString.ts";
import { MultiLineString } from "./MultiLineString.ts";
import { MultiPoint } from "./MultiPoint.ts";
import { MultiPolygon } from "./MultiPolygon.ts";
import { Point } from "./Point.ts";
import { Polygon } from "./Polygon.ts";

export const Geometry = Schema.Union(
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
);

export const parseGeometry = Schema.decodeUnknown(Geometry);

export const isValidGeometry = Schema.is(Geometry);

export const encodeGeometry = Schema.encode(Geometry);
