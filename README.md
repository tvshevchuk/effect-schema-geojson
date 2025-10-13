# Effect Schema GeoJSON

[![npm version](https://badge.fury.io/js/effect-schema-geojson.svg)](https://badge.fury.io/js/effect-schema-geojson)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A comprehensive Effect Schema library for validating and parsing GeoJSON data types according to [RFC 7946](https://tools.ietf.org/html/rfc7946).

## Installation

```bash
npm install effect-schema-geojson effect
# or
pnpm add effect-schema-geojson effect
# or
yarn add effect-schema-geojson effect
```

> **Note**: This library requires `effect` as a peer dependency.

## Features

- ✅ Complete GeoJSON specification support (RFC 7946)
- ✅ All geometry types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, GeometryCollection
- ✅ Feature and FeatureCollection support
- ✅ Bounding box validation
- ✅ Type-safe parsing and validation
- ✅ JSON Schema generation
- ✅ Built with Effect Schema for powerful composition and error handling

## Quick Start

```typescript
import { Effect, Schema } from "effect";
import { parseGeoJSON, isValidGeoJSON, Point } from "effect-schema-geojson";

// Validate any GeoJSON object
const someData = {
  type: "Point",
  coordinates: [102.0, 0.5]
};

// Type guard validation
if (isValidGeoJSON(someData)) {
  console.log("Valid GeoJSON!", someData);
}

// Effect-based parsing with detailed error handling
const parseResult = await Effect.runPromise(parseGeoJSON(someData));
console.log("Parsed GeoJSON:", parseResult);

// Create a Point schema directly
const pointData = {
  type: "Point",
  coordinates: [102.0, 0.5]
};

const pointResult = await Effect.runPromise(
  Schema.decodeUnknown(Point)(pointData)
);
```

## API Reference

### Geometry Types

#### Point

```typescript
import { Point, parsePoint } from "effect-schema-geojson";

const point = {
  type: "Point",
  coordinates: [102.0, 0.5]
};

const result = await Effect.runPromise(parsePoint(point));
```

#### MultiPoint

```typescript
import { MultiPoint } from "effect-schema-geojson";

const multiPoint = {
  type: "MultiPoint",
  coordinates: [
    [102.0, 0.5],
    [103.0, 1.0]
  ]
};
```

#### LineString

```typescript
import { LineString } from "effect-schema-geojson";

const lineString = {
  type: "LineString",
  coordinates: [
    [102.0, 0.0],
    [103.0, 1.0],
    [104.0, 0.0],
    [105.0, 1.0]
  ]
};
```

#### MultiLineString

```typescript
import { MultiLineString } from "effect-schema-geojson";

const multiLineString = {
  type: "MultiLineString",
  coordinates: [
    [
      [102.0, 0.0],
      [103.0, 1.0]
    ],
    [
      [104.0, 0.0],
      [105.0, 1.0]
    ]
  ]
};
```

#### Polygon

```typescript
import { Polygon } from "effect-schema-geojson";

const polygon = {
  type: "Polygon",
  coordinates: [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ]
  ]
};
```

#### MultiPolygon

```typescript
import { MultiPolygon } from "effect-schema-geojson";

const multiPolygon = {
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0]
      ]
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ]
    ]
  ]
};
```

#### GeometryCollection

```typescript
import { GeometryCollection } from "effect-schema-geojson";

const geometryCollection = {
  type: "GeometryCollection",
  geometries: [
    {
      type: "Point",
      coordinates: [102.0, 0.5]
    },
    {
      type: "LineString",
      coordinates: [
        [102.0, 0.0],
        [103.0, 1.0]
      ]
    }
  ]
};
```

### Feature and FeatureCollection

#### Feature

```typescript
import { Feature } from "effect-schema-geojson";

const feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [102.0, 0.5]
  },
  properties: {
    name: "Sample Point",
    category: "landmark"
  },
  id: "point-001"
};
```

#### FeatureCollection

```typescript
import { FeatureCollection } from "effect-schema-geojson";

const featureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [102.0, 0.5]
      },
      properties: {
        name: "Point 1"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [103.0, 1.5]
      },
      properties: {
        name: "Point 2"
      }
    }
  ]
};
```

### Utility Functions

#### Parsing Functions

All parsing functions return `Effect<T, ParseError>` for robust error handling:

- `parseGeoJSON(input: unknown)` - Parse any GeoJSON object
- `parseGeometry(input: unknown)` - Parse any geometry
- `parseFeature(input: unknown)` - Parse a feature
- `parseFeatureCollection(input: unknown)` - Parse a feature collection
- `parsePoint(input: unknown)` - Parse a point geometry
- `parseLineString(input: unknown)` - Parse a linestring geometry
- `parsePolygon(input: unknown)` - Parse a polygon geometry

#### Validation Functions

Type guard functions that return `boolean`:

- `isValidGeoJSON(input: unknown)` - Check if input is valid GeoJSON
- `isValidGeometry(input: unknown)` - Check if input is valid geometry
- `isValidFeature(input: unknown)` - Check if input is valid feature
- `isValidFeatureCollection(input: unknown)` - Check if input is valid feature collection
- `isValidPoint(input: unknown)` - Check if input is valid point
- `isValidLineString(input: unknown)` - Check if input is valid linestring
- `isValidPolygon(input: unknown)` - Check if input is valid polygon

#### Encoding Functions

For serialization back to unknown/JSON:

- `encodeGeoJSON(input: GeoJSONType)` - Encode GeoJSON to unknown
- `encodeGeometry(input: GeometryType)` - Encode geometry to unknown
- `encodeFeature(input: FeatureType)` - Encode feature to unknown
- `encodeFeatureCollection(input: FeatureCollectionType)` - Encode feature collection to unknown

### Error Handling

```typescript
import { Effect } from "effect";
import { parseGeoJSON } from "effect-schema-geojson";

const invalidData = { type: "InvalidType" };

const program = parseGeoJSON(invalidData).pipe(
  Effect.catchAll((error) => {
    console.error("Parsing failed:", error);
    return Effect.succeed(null);
  })
);

const result = await Effect.runPromise(program);
```

### Working with Effect Schema

Since this library is built on Effect Schema, you can compose these schemas with other Effect Schema types and take advantage of all Effect Schema features like transformations, refinements, and more detailed error handling.

```typescript
import { Schema } from "effect";
import { Point } from "effect-schema-geojson";

// Compose with other schemas
const LocationData = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  coordinates: Point,
  metadata: Schema.Record({ key: Schema.String, value: Schema.Unknown })
});
```

## Bounding Boxes

All geometry types support optional bounding boxes:

```typescript
const pointWithBbox = {
  type: "Point",
  coordinates: [102.0, 0.5],
  bbox: [102.0, 0.5, 102.0, 0.5] // [west, south, east, north]
};
```

## TypeScript Types

The library exports TypeScript types for all GeoJSON objects:

```typescript
import type {
  GeoJSONType,
  GeometryType,
  PointType,
  LineStringType,
  PolygonType,
  FeatureType,
  FeatureCollectionType,
  Position,
  BoundingBox
} from "effect-schema-geojson";
```

## Effect Schema Integration

This library is built on Effect Schema, which means you can compose these schemas with other Effect Schema types:

```typescript
import { Schema } from "effect";
import { Point } from "effect-schema-geojson";

const MyDataSchema = Schema.Struct({
  id: Schema.String,
  location: Point,
  metadata: Schema.Record({ key: Schema.String, value: Schema.String })
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests on [GitHub](https://github.com/tvshevchuk/effect-schema-geojson).

## Related

- [Effect](https://effect.website/) - The Effect ecosystem
- [GeoJSON Specification (RFC 7946)](https://tools.ietf.org/html/rfc7946)
- [@types/geojson](https://www.npmjs.com/package/@types/geojson) - TypeScript definitions for GeoJSON