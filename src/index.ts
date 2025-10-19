/**
 * Effect Schema for GeoJSON types
 *
 * This library provides Effect Schema definitions for all GeoJSON types
 * as specified in RFC 7946: https://tools.ietf.org/html/rfc7946
 */

export * from "./features/index.ts";
export * from "./GeoJSON.ts";
export * from "./geometries/index.ts";
// Re-export everything from submodules
export * from "./primitives/index.ts";
