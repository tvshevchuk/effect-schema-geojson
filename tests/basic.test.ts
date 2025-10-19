import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import {
  isValidFeature,
  isValidGeoJSON,
  isValidLineString,
  isValidPoint,
  isValidPolygon,
  parseFeature,
  parseFeatureCollection,
  parseGeoJSON,
  parseLineString,
  parsePoint,
  parsePolygon,
} from "../src/index.js";

describe("Effect Schema GeoJSON", () => {
  describe("Point", () => {
    it("should validate and parse a valid Point", async () => {
      const pointData = {
        type: "Point",
        coordinates: [102.0, 0.5],
      };

      expect(isValidPoint(pointData)).toBe(true);

      const result = await Effect.runPromise(parsePoint(pointData));
      expect(result.type).toBe("Point");
      expect(result.coordinates[0]).toBe(102.0);
    });

    it("should fail validation for invalid Point coordinates", async () => {
      const invalidPoint = {
        type: "Point",
        coordinates: "invalid",
      };

      expect(isValidPoint(invalidPoint)).toBe(false);

      await expect(
        Effect.runPromise(parsePoint(invalidPoint)),
      ).rejects.toThrow();
    });

    it("should validate Point with bounding box", async () => {
      const pointWithBbox = {
        type: "Point",
        coordinates: [102.0, 0.5],
        bbox: [102.0, 0.5, 102.0, 0.5],
      };

      expect(isValidPoint(pointWithBbox)).toBe(true);

      const result = await Effect.runPromise(parsePoint(pointWithBbox));
      expect(result.bbox).toBeDefined();
      expect(result.bbox?.length).toBe(4);
    });
  });

  describe("LineString", () => {
    it("should validate and parse a valid LineString", async () => {
      const lineStringData = {
        type: "LineString",
        coordinates: [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
        ],
      };

      expect(isValidLineString(lineStringData)).toBe(true);

      const result = await Effect.runPromise(parseLineString(lineStringData));
      expect(result.coordinates.length).toBe(3);
    });

    it("should fail validation for LineString with too few coordinates", () => {
      const invalidLineString = {
        type: "LineString",
        coordinates: [[102.0, 0.0]], // Only one point
      };

      expect(isValidLineString(invalidLineString)).toBe(false);
    });
  });

  describe("Polygon", () => {
    it("should validate and parse a valid Polygon", async () => {
      const polygonData = {
        type: "Polygon",
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
        ],
      };

      expect(isValidPolygon(polygonData)).toBe(true);

      const result = await Effect.runPromise(parsePolygon(polygonData));
      expect(result.coordinates[0].length).toBe(5);
    });
  });

  describe("Feature", () => {
    it("should validate and parse a valid Feature", async () => {
      const featureData = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.0, 0.5],
        },
        properties: {
          name: "Test Point",
        },
        id: "test-001",
      };

      expect(isValidFeature(featureData)).toBe(true);

      const result = await Effect.runPromise(parseFeature(featureData));
      expect(result.properties).toBeDefined();
      expect(result.properties?.name).toBe("Test Point");
    });

    it("should validate Feature with null geometry", async () => {
      const featureWithNullGeometry = {
        type: "Feature",
        geometry: null,
        properties: {
          name: "No geometry feature",
        },
      };

      expect(isValidFeature(featureWithNullGeometry)).toBe(true);

      const result = await Effect.runPromise(
        parseFeature(featureWithNullGeometry),
      );
      expect(result.geometry).toBe(null);
    });
  });

  describe("FeatureCollection", () => {
    it("should validate and parse a valid FeatureCollection", async () => {
      const featureCollectionData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [102.0, 0.5],
            },
            properties: {
              name: "Point 1",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [103.0, 1.5],
            },
            properties: {
              name: "Point 2",
            },
          },
        ],
      };

      expect(isValidGeoJSON(featureCollectionData)).toBe(true);

      const result = await Effect.runPromise(
        parseFeatureCollection(featureCollectionData),
      );
      expect(result.features.length).toBe(2);
    });
  });

  describe("GeometryCollection", () => {
    it("should validate and parse a valid GeometryCollection", async () => {
      const geometryCollectionData = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Point",
            coordinates: [102.0, 0.5],
          },
          {
            type: "LineString",
            coordinates: [
              [102.0, 0.0],
              [103.0, 1.0],
            ],
          },
        ],
      };

      expect(isValidGeoJSON(geometryCollectionData)).toBe(true);

      const result = await Effect.runPromise(
        parseGeoJSON(geometryCollectionData),
      );
      expect(result.type).toBe("GeometryCollection");
    });
  });

  describe("MultiPoint", () => {
    it("should validate and parse a valid MultiPoint", async () => {
      const multiPointData = {
        type: "MultiPoint",
        coordinates: [
          [102.0, 0.5],
          [103.0, 1.0],
        ],
      };

      expect(isValidGeoJSON(multiPointData)).toBe(true);

      const result = await Effect.runPromise(parseGeoJSON(multiPointData));
      expect(result.type).toBe("MultiPoint");
    });
  });

  describe("MultiPolygon", () => {
    it("should validate and parse a valid MultiPolygon", async () => {
      const multiPolygonData = {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [102.0, 2.0],
              [103.0, 2.0],
              [103.0, 3.0],
              [102.0, 3.0],
              [102.0, 2.0],
            ],
          ],
          [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0],
            ],
          ],
        ],
      };

      expect(isValidGeoJSON(multiPolygonData)).toBe(true);

      const result = await Effect.runPromise(parseGeoJSON(multiPolygonData));
      expect(result.type).toBe("MultiPolygon");
    });
  });

  describe("Invalid GeoJSON", () => {
    it("should fail validation for invalid GeoJSON type", async () => {
      const invalidGeoJSON = {
        type: "InvalidType",
        coordinates: [102.0, 0.5],
      };

      expect(isValidGeoJSON(invalidGeoJSON)).toBe(false);

      await expect(
        Effect.runPromise(parseGeoJSON(invalidGeoJSON)),
      ).rejects.toThrow();
    });
  });
});
