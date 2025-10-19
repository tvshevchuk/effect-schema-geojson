import { Schema } from "effect";

export const BoundingBox = Schema.Array(Schema.Number)
  .pipe(Schema.minItems(4), Schema.maxItems(6))
  .annotations({
    description: "A GeoJSON bounding box",
  });

export type BoundingBox = typeof BoundingBox.Type;
