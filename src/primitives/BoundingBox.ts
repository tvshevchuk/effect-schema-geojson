import { Schema } from "effect";

const BoundingBox2D = Schema.Tuple(
  Schema.Number,
  Schema.Number,
  Schema.Number,
  Schema.Number,
);

const BoundingBox3D = Schema.Tuple(
  Schema.Number,
  Schema.Number,
  Schema.Number,
  Schema.Number,
  Schema.Number,
  Schema.Number,
);

export const BoundingBox = Schema.Union(
  BoundingBox2D,
  BoundingBox3D,
).annotations({
  description: "A GeoJSON bounding box",
});

export type BoundingBox = typeof BoundingBox.Type;
