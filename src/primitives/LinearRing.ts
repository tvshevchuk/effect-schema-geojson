import { Schema } from "effect";
import { Position } from "./Position.ts";

export const LinearRing = Schema.Array(Position)
  .pipe(Schema.minItems(4))
  .annotations({
    description:
      "A LinearRing with at least 4 positions where first and last are equivalent",
  });

export type LinearRing = typeof LinearRing.Type;
