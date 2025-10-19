/**
 * Effect Schema for GeoJSON types
 *
 * This library provides Effect Schema definitions for all GeoJSON types
 * as specified in RFC 7946: https://tools.ietf.org/html/rfc7946
 */

import { Schema } from "effect";

// Basic types
export const BoundingBox: Schema.Schema<readonly number[]> = Schema.Array(
	Schema.Number,
)
	.pipe(Schema.minItems(4), Schema.maxItems(6))
	.annotations({
		description: "A GeoJSON bounding box",
	});

export const Position: Schema.Schema<readonly number[]> = Schema.Array(
	Schema.Number,
)
	.pipe(Schema.minItems(2))
	.annotations({
		description:
			"A position represented by longitude and latitude (and optionally altitude)",
	});

export const LinearRing: Schema.Schema<readonly (readonly number[])[]> =
	Schema.Array(Position).pipe(Schema.minItems(4)).annotations({
		description:
			"A LinearRing with at least 4 positions where first and last are equivalent",
	});

// Point geometry
export const Point: Schema.Schema<{
	readonly type: "Point";
	readonly coordinates: readonly number[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("Point"),
	coordinates: Position,
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A Point geometry",
});

// MultiPoint geometry
export const MultiPoint: Schema.Schema<{
	readonly type: "MultiPoint";
	readonly coordinates: readonly (readonly number[])[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("MultiPoint"),
	coordinates: Schema.Array(Position),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A MultiPoint geometry",
});

// LineString geometry
export const LineString: Schema.Schema<{
	readonly type: "LineString";
	readonly coordinates: readonly (readonly number[])[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("LineString"),
	coordinates: Schema.Array(Position).pipe(Schema.minItems(2)),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A LineString geometry",
});

// MultiLineString geometry
export const MultiLineString: Schema.Schema<{
	readonly type: "MultiLineString";
	readonly coordinates: readonly (readonly (readonly number[])[])[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("MultiLineString"),
	coordinates: Schema.Array(Schema.Array(Position).pipe(Schema.minItems(2))),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A MultiLineString geometry",
});

// Polygon geometry
export const Polygon: Schema.Schema<{
	readonly type: "Polygon";
	readonly coordinates: readonly (readonly (readonly number[])[])[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("Polygon"),
	coordinates: Schema.Array(LinearRing).pipe(Schema.minItems(1)),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A Polygon geometry",
});

// MultiPolygon geometry
export const MultiPolygon: Schema.Schema<{
	readonly type: "MultiPolygon";
	readonly coordinates: readonly (readonly (readonly (readonly number[])[])[])[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("MultiPolygon"),
	coordinates: Schema.Array(Schema.Array(LinearRing).pipe(Schema.minItems(1))),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A MultiPolygon geometry",
});

// Basic geometries union (without GeometryCollection to avoid circular reference)
const BasicGeometry: Schema.Schema<
	| {
			readonly type: "Point";
			readonly coordinates: readonly number[];
			readonly bbox?: readonly number[];
	  }
	| {
			readonly type: "MultiPoint";
			readonly coordinates: readonly (readonly number[])[];
			readonly bbox?: readonly number[];
	  }
	| {
			readonly type: "LineString";
			readonly coordinates: readonly (readonly number[])[];
			readonly bbox?: readonly number[];
	  }
	| {
			readonly type: "MultiLineString";
			readonly coordinates: readonly (readonly (readonly number[])[])[];
			readonly bbox?: readonly number[];
	  }
	| {
			readonly type: "Polygon";
			readonly coordinates: readonly (readonly (readonly number[])[])[];
			readonly bbox?: readonly number[];
	  }
	| {
			readonly type: "MultiPolygon";
			readonly coordinates: readonly (readonly (readonly (readonly number[])[])[])[];
			readonly bbox?: readonly number[];
	  }
> = Schema.Union(
	Point,
	MultiPoint,
	LineString,
	MultiLineString,
	Polygon,
	MultiPolygon,
);

// GeometryCollection with proper recursive definition
export const GeometryCollection: Schema.Schema<{
	readonly type: "GeometryCollection";
	readonly geometries: readonly unknown[];
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("GeometryCollection"),
	geometries: Schema.Array(Schema.suspend(() => Geometry)),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A collection of geometry objects",
});

// Complete geometry union including GeometryCollection
export const Geometry: Schema.Schema<any> = Schema.Union(
	BasicGeometry,
	GeometryCollection,
).annotations({
	description: "Any GeoJSON geometry",
});

// Feature
export const Feature: Schema.Schema<{
	readonly type: "Feature";
	readonly geometry: unknown;
	readonly properties: { readonly [x: string]: unknown } | null;
	readonly id?: string | number;
	readonly bbox?: readonly number[];
}> = Schema.Struct({
	type: Schema.Literal("Feature"),
	geometry: Schema.Union(Geometry, Schema.Null),
	properties: Schema.Union(
		Schema.Record({ key: Schema.String, value: Schema.Unknown }),
		Schema.Null,
	),
	id: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A GeoJSON feature",
});

// FeatureCollection
export const FeatureCollection: Schema.Schema<any> = Schema.Struct({
	type: Schema.Literal("FeatureCollection"),
	features: Schema.Array(Feature),
	bbox: Schema.optional(BoundingBox),
}).annotations({
	description: "A collection of GeoJSON features",
});

// Union of all GeoJSON types
export const GeoJSON: Schema.Schema<any> = Schema.Union(
	Geometry,
	Feature,
	FeatureCollection,
).annotations({
	description: "Any valid GeoJSON object",
});

// Type exports for TypeScript users
export type Position = Schema.Schema.Type<typeof Position>;
export type BoundingBox = Schema.Schema.Type<typeof BoundingBox>;
export type LinearRing = Schema.Schema.Type<typeof LinearRing>;
export type Point = Schema.Schema.Type<typeof Point>;
export type MultiPoint = Schema.Schema.Type<typeof MultiPoint>;
export type LineString = Schema.Schema.Type<typeof LineString>;
export type MultiLineString = Schema.Schema.Type<typeof MultiLineString>;
export type Polygon = Schema.Schema.Type<typeof Polygon>;
export type MultiPolygon = Schema.Schema.Type<typeof MultiPolygon>;
export type GeometryCollection = Schema.Schema.Type<typeof GeometryCollection>;
export type Geometry = Schema.Schema.Type<typeof Geometry>;
export type Feature = Schema.Schema.Type<typeof Feature>;
export type FeatureCollection = Schema.Schema.Type<typeof FeatureCollection>;
export type GeoJSON = Schema.Schema.Type<typeof GeoJSON>;

// Utility functions for parsing (decoding from unknown)
export const parseGeoJSON: (
	input: unknown,
) => import("effect/Effect").Effect<
	any,
	import("effect/ParseResult").ParseError,
	any
> = Schema.decodeUnknown(GeoJSON);
export const parseGeometry: (
	input: unknown,
) => import("effect/Effect").Effect<
	any,
	import("effect/ParseResult").ParseError,
	any
> = Schema.decodeUnknown(Geometry);
export const parseFeature: (input: unknown) => import("effect/Effect").Effect<
	{
		readonly type: "Feature";
		readonly geometry: unknown;
		readonly properties: { readonly [x: string]: unknown } | null;
		readonly id?: string | number;
		readonly bbox?: readonly number[];
	},
	import("effect/ParseResult").ParseError,
	unknown
> = Schema.decodeUnknown(Feature);
export const parseFeatureCollection: (
	input: unknown,
) => import("effect/Effect").Effect<
	any,
	import("effect/ParseResult").ParseError,
	any
> = Schema.decodeUnknown(FeatureCollection);
export const parsePoint: (input: unknown) => import("effect/Effect").Effect<
	{
		readonly type: "Point";
		readonly coordinates: readonly number[];
		readonly bbox?: readonly number[];
	},
	import("effect/ParseResult").ParseError,
	unknown
> = Schema.decodeUnknown(Point);
export const parseLineString: (
	input: unknown,
) => import("effect/Effect").Effect<
	{
		readonly type: "LineString";
		readonly coordinates: readonly (readonly number[])[];
		readonly bbox?: readonly number[];
	},
	import("effect/ParseResult").ParseError,
	unknown
> = Schema.decodeUnknown(LineString);
export const parsePolygon: (input: unknown) => import("effect/Effect").Effect<
	{
		readonly type: "Polygon";
		readonly coordinates: readonly (readonly (readonly number[])[])[];
		readonly bbox?: readonly number[];
	},
	import("effect/ParseResult").ParseError,
	unknown
> = Schema.decodeUnknown(Polygon);

// Validation functions that return boolean
export const isValidGeoJSON: (input: unknown) => input is any =
	Schema.is(GeoJSON);
export const isValidGeometry: (input: unknown) => input is any =
	Schema.is(Geometry);
export const isValidFeature: (input: unknown) => input is {
	readonly type: "Feature";
	readonly geometry: unknown;
	readonly properties: { readonly [x: string]: unknown } | null;
	readonly id?: string | number;
	readonly bbox?: readonly number[];
} = Schema.is(Feature);
export const isValidFeatureCollection: (input: unknown) => input is any =
	Schema.is(FeatureCollection);
export const isValidPoint: (input: unknown) => input is {
	readonly type: "Point";
	readonly coordinates: readonly number[];
	readonly bbox?: readonly number[];
} = Schema.is(Point);
export const isValidLineString: (input: unknown) => input is {
	readonly type: "LineString";
	readonly coordinates: readonly (readonly number[])[];
	readonly bbox?: readonly number[];
} = Schema.is(LineString);
export const isValidPolygon: (input: unknown) => input is {
	readonly type: "Polygon";
	readonly coordinates: readonly (readonly (readonly number[])[])[];
	readonly bbox?: readonly number[];
} = Schema.is(Polygon);

// Encoding functions (for serialization)
export const encodeGeoJSON: (
	input: any,
) => import("effect/Effect").Effect<
	unknown,
	import("effect/ParseResult").ParseError,
	any
> = Schema.encode(GeoJSON);
export const encodeGeometry: (
	input: any,
) => import("effect/Effect").Effect<
	unknown,
	import("effect/ParseResult").ParseError,
	any
> = Schema.encode(Geometry);
export const encodeFeature: (input: {
	readonly type: "Feature";
	readonly geometry: unknown;
	readonly properties: { readonly [x: string]: unknown } | null;
	readonly id?: string | number;
	readonly bbox?: readonly number[];
}) => import("effect/Effect").Effect<
	unknown,
	import("effect/ParseResult").ParseError,
	unknown
> = Schema.encode(Feature);
export const encodeFeatureCollection: (
	input: any,
) => import("effect/Effect").Effect<
	unknown,
	import("effect/ParseResult").ParseError,
	any
> = Schema.encode(FeatureCollection);

// Note: JSON Schema generation is not available in this version of Effect
// You can generate JSON schemas using other tools if needed
