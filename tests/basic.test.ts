import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import {
  isValidFeature,
  isValidFeatureCollection,
  isValidGeoJSON,
  isValidGeometry,
  isValidGeometryCollection,
  isValidLineString,
  isValidMultiLineString,
  isValidMultiPoint,
  isValidMultiPolygon,
  isValidPoint,
  isValidPolygon,
  parseFeature,
  parseFeatureCollection,
  parseGeoJSON,
  parseGeometryCollection,
  parseLineString,
  parseMultiLineString,
  parseMultiPoint,
  parseMultiPolygon,
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

    it("should validate Point with 3D coordinates (altitude)", async () => {
      const point3D = {
        type: "Point",
        coordinates: [102.0, 0.5, 100.0],
      };

      expect(isValidPoint(point3D)).toBe(true);

      const result = await Effect.runPromise(parsePoint(point3D));
      expect(result.coordinates.length).toBe(3);
      expect(result.coordinates[2]).toBe(100.0);
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

    it("should fail validation for Point with too few coordinates", () => {
      const invalidPoint = {
        type: "Point",
        coordinates: [102.0], // Only one coordinate
      };

      expect(isValidPoint(invalidPoint)).toBe(false);
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

    it("should validate Point with 3D bounding box (6 elements)", async () => {
      const pointWith3DBbox = {
        type: "Point",
        coordinates: [102.0, 0.5, 100.0],
        bbox: [102.0, 0.5, 50.0, 102.0, 0.5, 150.0],
      };

      expect(isValidPoint(pointWith3DBbox)).toBe(true);

      const result = await Effect.runPromise(parsePoint(pointWith3DBbox));
      expect(result.bbox?.length).toBe(6);
    });

    it("should fail validation for invalid bounding box (wrong length)", () => {
      const invalidBbox = {
        type: "Point",
        coordinates: [102.0, 0.5],
        bbox: [102.0, 0.5, 102.0], // Only 3 elements
      };

      expect(isValidPoint(invalidBbox)).toBe(false);
    });

    it("should fail validation for bounding box with 5 elements", () => {
      const invalidBbox = {
        type: "Point",
        coordinates: [102.0, 0.5],
        bbox: [102.0, 0.5, 10.0, 20.0, 30.0],
      };

      expect(isValidPoint(invalidBbox)).toBe(false);
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

    it("should validate LineString with exactly 2 coordinates", async () => {
      const minLineString = {
        type: "LineString",
        coordinates: [
          [102.0, 0.0],
          [103.0, 1.0],
        ],
      };

      expect(isValidLineString(minLineString)).toBe(true);

      const result = await Effect.runPromise(parseLineString(minLineString));
      expect(result.coordinates.length).toBe(2);
    });
  });

  describe("MultiLineString", () => {
    it("should validate and parse a valid MultiLineString", async () => {
      const multiLineStringData = {
        type: "MultiLineString",
        coordinates: [
          [
            [102.0, 0.0],
            [103.0, 1.0],
          ],
          [
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        ],
      };

      expect(isValidMultiLineString(multiLineStringData)).toBe(true);

      const result = await Effect.runPromise(
        parseMultiLineString(multiLineStringData),
      );
      expect(result.type).toBe("MultiLineString");
      expect(result.coordinates.length).toBe(2);
    });

    it("should fail validation for MultiLineString with invalid line", () => {
      const invalidMultiLineString = {
        type: "MultiLineString",
        coordinates: [
          [[102.0, 0.0]], // Only one point in first line
          [
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        ],
      };

      expect(isValidMultiLineString(invalidMultiLineString)).toBe(false);
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

    it("should validate Polygon with hole (interior ring)", async () => {
      const polygonWithHole = {
        type: "Polygon",
        coordinates: [
          // Exterior ring
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
          // Interior ring (hole)
          [
            [100.2, 0.2],
            [100.8, 0.2],
            [100.8, 0.8],
            [100.2, 0.8],
            [100.2, 0.2],
          ],
        ],
      };

      expect(isValidPolygon(polygonWithHole)).toBe(true);

      const result = await Effect.runPromise(parsePolygon(polygonWithHole));
      expect(result.coordinates.length).toBe(2);
    });

    it("should fail validation for LinearRing with too few positions", () => {
      const invalidPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [100.0, 0.0], // Only 3 positions
          ],
        ],
      };

      expect(isValidPolygon(invalidPolygon)).toBe(false);
    });

    it("should fail validation for unclosed LinearRing", () => {
      const unclosedPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0], // Not closed - doesn't match first position
          ],
        ],
      };

      expect(isValidPolygon(unclosedPolygon)).toBe(false);
    });

    it("should fail validation for empty coordinates array", () => {
      const emptyPolygon = {
        type: "Polygon",
        coordinates: [],
      };

      expect(isValidPolygon(emptyPolygon)).toBe(false);
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

      expect(isValidMultiPolygon(multiPolygonData)).toBe(true);

      const result = await Effect.runPromise(
        parseMultiPolygon(multiPolygonData),
      );
      expect(result.type).toBe("MultiPolygon");
      expect(result.coordinates.length).toBe(2);
    });

    it("should fail validation for MultiPolygon with unclosed ring", () => {
      const invalidMultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [102.0, 2.0],
              [103.0, 2.0],
              [103.0, 3.0],
              [102.0, 3.0], // Not closed
            ],
          ],
        ],
      };

      expect(isValidMultiPolygon(invalidMultiPolygon)).toBe(false);
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

      expect(isValidMultiPoint(multiPointData)).toBe(true);

      const result = await Effect.runPromise(parseMultiPoint(multiPointData));
      expect(result.type).toBe("MultiPoint");
      expect(result.coordinates.length).toBe(2);
    });

    it("should validate empty MultiPoint", () => {
      const emptyMultiPoint = {
        type: "MultiPoint",
        coordinates: [],
      };

      expect(isValidMultiPoint(emptyMultiPoint)).toBe(true);
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

    it("should validate Feature with null properties", async () => {
      const featureWithNullProperties = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.0, 0.5],
        },
        properties: null,
      };

      expect(isValidFeature(featureWithNullProperties)).toBe(true);

      const result = await Effect.runPromise(
        parseFeature(featureWithNullProperties),
      );
      expect(result.properties).toBe(null);
    });

    it("should validate Feature with numeric id", async () => {
      const featureWithNumericId = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.0, 0.5],
        },
        properties: {},
        id: 123,
      };

      expect(isValidFeature(featureWithNumericId)).toBe(true);

      const result = await Effect.runPromise(
        parseFeature(featureWithNumericId),
      );
      expect(result.id).toBe(123);
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

      expect(isValidFeatureCollection(featureCollectionData)).toBe(true);

      const result = await Effect.runPromise(
        parseFeatureCollection(featureCollectionData),
      );
      expect(result.features.length).toBe(2);
    });

    it("should validate empty FeatureCollection", async () => {
      const emptyFeatureCollection = {
        type: "FeatureCollection",
        features: [],
      };

      expect(isValidFeatureCollection(emptyFeatureCollection)).toBe(true);

      const result = await Effect.runPromise(
        parseFeatureCollection(emptyFeatureCollection),
      );
      expect(result.features.length).toBe(0);
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

      expect(isValidGeometryCollection(geometryCollectionData)).toBe(true);

      const result = await Effect.runPromise(
        parseGeometryCollection(geometryCollectionData),
      );
      expect(result.type).toBe("GeometryCollection");
      expect(result.geometries.length).toBe(2);
    });

    it("should validate GeometryCollection with all geometry types", async () => {
      const geometryCollectionData = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Point",
            coordinates: [102.0, 0.5],
          },
          {
            type: "MultiPoint",
            coordinates: [
              [102.0, 0.5],
              [103.0, 1.0],
            ],
          },
          {
            type: "LineString",
            coordinates: [
              [102.0, 0.0],
              [103.0, 1.0],
            ],
          },
          {
            type: "MultiLineString",
            coordinates: [
              [
                [102.0, 0.0],
                [103.0, 1.0],
              ],
            ],
          },
          {
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
          },
          {
            type: "MultiPolygon",
            coordinates: [
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
          },
        ],
      };

      expect(isValidGeometryCollection(geometryCollectionData)).toBe(true);

      const result = await Effect.runPromise(
        parseGeometryCollection(geometryCollectionData),
      );
      expect(result.geometries.length).toBe(6);
    });

    it("should validate nested GeometryCollection", async () => {
      const geometryCollectionData = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "GeometryCollection",
            geometries: [],
          },
        ],
      };

      expect(isValidGeometryCollection(geometryCollectionData)).toBe(true);

      const result = await Effect.runPromise(
        parseGeometryCollection(geometryCollectionData),
      );
      expect(result.geometries.length).toBe(1);
    });

    it("should validate empty GeometryCollection", async () => {
      const emptyGeometryCollection = {
        type: "GeometryCollection",
        geometries: [],
      };

      expect(isValidGeometryCollection(emptyGeometryCollection)).toBe(true);

      const result = await Effect.runPromise(
        parseGeometryCollection(emptyGeometryCollection),
      );
      expect(result.geometries.length).toBe(0);
    });
  });

  describe("Geometry", () => {
    it("should validate any geometry type with isValidGeometry", () => {
      expect(isValidGeometry({ type: "Point", coordinates: [0, 0] })).toBe(
        true,
      );
      expect(
        isValidGeometry({
          type: "LineString",
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        }),
      ).toBe(true);
      expect(
        isValidGeometry({
          type: "GeometryCollection",
          geometries: [],
        }),
      ).toBe(true);
    });
  });

  describe("GeoJSON", () => {
    it("should validate any GeoJSON type with isValidGeoJSON", () => {
      expect(isValidGeoJSON({ type: "Point", coordinates: [0, 0] })).toBe(true);
      expect(
        isValidGeoJSON({
          type: "Feature",
          geometry: null,
          properties: null,
        }),
      ).toBe(true);
      expect(
        isValidGeoJSON({
          type: "FeatureCollection",
          features: [],
        }),
      ).toBe(true);
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

    it("should fail validation for missing type property", () => {
      const noType = {
        coordinates: [102.0, 0.5],
      };

      expect(isValidGeoJSON(noType)).toBe(false);
    });

    it("should fail validation for missing coordinates", () => {
      const noCoordinates = {
        type: "Point",
      };

      expect(isValidPoint(noCoordinates)).toBe(false);
    });
  });
});
