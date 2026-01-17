/**
 * Effect Schema for GeoJSON types
 *
 * This library provides Effect Schema definitions for all GeoJSON types
 * as specified in RFC 7946: https://tools.ietf.org/html/rfc7946
 */

// Re-export everything from submodules
export * from "./features/index.ts";
export * from "./GeoJSON.ts";
export * from "./geometries/index.ts";
export * from "./primitives/index.ts";
