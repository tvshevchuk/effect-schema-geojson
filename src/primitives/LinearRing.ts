import { Schema } from "effect";
import { Position } from "./Position.ts";

/**
 * Checks if two positions are equivalent (same coordinates).
 */
const positionsEqual = (
  a: readonly number[],
  b: readonly number[],
): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};

export const LinearRing = Schema.Array(Position)
  .pipe(
    Schema.minItems(4),
    Schema.filter(
      (ring) => {
        const first = ring[0];
        const last = ring[ring.length - 1];
        return positionsEqual(first, last);
      },
      {
        message: () =>
          "LinearRing must be closed: first and last positions must be equivalent",
      },
    ),
  )
  .annotations({
    description:
      "A LinearRing with at least 4 positions where first and last are equivalent",
  });

export type LinearRing = typeof LinearRing.Type;
