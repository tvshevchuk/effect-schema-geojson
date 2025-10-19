import { Schema } from "effect";

export const Position = Schema.Array(Schema.Number)
  .pipe(Schema.minItems(2))
  .annotations({
    description:
      "A position represented by longitude and latitude (and optionally altitude)",
  });

export type Position = typeof Position.Type;
