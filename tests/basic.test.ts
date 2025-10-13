import { Effect } from "effect";
import {
  parseGeoJSON,
  parsePoint,
  parseFeature,
  parseFeatureCollection,
  parseLineString,
  parsePolygon,
  isValidGeoJSON,
  isValidPoint,
  isValidFeature,
  isValidLineString,
  isValidPolygon,
} from "../src/index.js";

// Test helpers
function runTest(name: string, testFn: () => Promise<void> | void) {
  console.log(`Running test: ${name}`);
  try {
    const result = testFn();
    if (result instanceof Promise) {
      return result.catch((error) => {
        console.error(`❌ Test failed: ${name}`, error);
        throw error;
      });
    }
  } catch (error) {
    console.error(`❌ Test failed: ${name}`, error);
    throw error;
  }
  console.log(`✅ Test passed: ${name}`);
}

async function runAllTests() {
  console.log("Starting Effect Schema GeoJSON tests...\n");

  // Test 1: Valid Point
  await runTest("Valid Point", async () => {
    const pointData = {
      type: "Point",
      coordinates: [102.0, 0.5],
    };

    if (!isValidPoint(pointData)) {
      throw new Error("Point validation failed");
    }

    const result: any = await Effect.runPromise(parsePoint(pointData) as any);
    if (result.type !== "Point" || result.coordinates[0] !== 102.0) {
      throw new Error("Point parsing failed");
    }
  });

  // Test 2: Invalid Point - wrong coordinates
  await runTest("Invalid Point coordinates", async () => {
    const invalidPoint = {
      type: "Point",
      coordinates: "invalid",
    };

    if (isValidPoint(invalidPoint)) {
      throw new Error("Should not validate invalid point");
    }

    try {
      await Effect.runPromise(parsePoint(invalidPoint) as any);
      throw new Error("Should have thrown an error");
    } catch {
      // Expected to fail
    }
  });

  // Test 3: Valid LineString
  await runTest("Valid LineString", async () => {
    const lineStringData = {
      type: "LineString",
      coordinates: [
        [102.0, 0.0],
        [103.0, 1.0],
        [104.0, 0.0],
      ],
    };

    if (!isValidLineString(lineStringData)) {
      throw new Error("LineString validation failed");
    }

    const result: any = await Effect.runPromise(
      parseLineString(lineStringData) as any,
    );
    if (result.coordinates.length !== 3) {
      throw new Error("LineString parsing failed");
    }
  });

  // Test 4: Invalid LineString - too few coordinates
  await runTest("Invalid LineString - too few coordinates", async () => {
    const invalidLineString = {
      type: "LineString",
      coordinates: [[102.0, 0.0]], // Only one point
    };

    if (isValidLineString(invalidLineString)) {
      throw new Error("Should not validate LineString with only one point");
    }
  });

  // Test 5: Valid Polygon
  await runTest("Valid Polygon", async () => {
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

    if (!isValidPolygon(polygonData)) {
      throw new Error("Polygon validation failed");
    }

    const result: any = await Effect.runPromise(
      parsePolygon(polygonData) as any,
    );
    if (result.coordinates[0].length !== 5) {
      throw new Error("Polygon parsing failed");
    }
  });

  // Test 6: Valid Feature
  await runTest("Valid Feature", async () => {
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

    if (!isValidFeature(featureData)) {
      throw new Error("Feature validation failed");
    }

    const result: any = await Effect.runPromise(
      parseFeature(featureData) as any,
    );
    if (
      !result.properties ||
      typeof result.properties !== "object" ||
      !("name" in result.properties) ||
      result.properties.name !== "Test Point"
    ) {
      throw new Error("Feature parsing failed");
    }
  });

  // Test 7: Feature with null geometry
  await runTest("Feature with null geometry", async () => {
    const featureWithNullGeometry = {
      type: "Feature",
      geometry: null,
      properties: {
        name: "No geometry feature",
      },
    };

    if (!isValidFeature(featureWithNullGeometry)) {
      throw new Error("Feature with null geometry should be valid");
    }

    const result: any = await Effect.runPromise(
      parseFeature(featureWithNullGeometry) as any,
    );
    if (result.geometry !== null) {
      throw new Error("Null geometry not preserved");
    }
  });

  // Test 8: Valid FeatureCollection
  await runTest("Valid FeatureCollection", async () => {
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

    if (!isValidGeoJSON(featureCollectionData)) {
      throw new Error("FeatureCollection validation failed");
    }

    const result = (await Effect.runPromise(
      parseFeatureCollection(featureCollectionData) as any,
    )) as any;
    if (result.features.length !== 2) {
      throw new Error("FeatureCollection parsing failed");
    }
  });

  // Test 9: GeometryCollection
  await runTest("Valid GeometryCollection", async () => {
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

    if (!isValidGeoJSON(geometryCollectionData)) {
      throw new Error("GeometryCollection validation failed");
    }

    const result = (await Effect.runPromise(
      parseGeoJSON(geometryCollectionData) as any,
    )) as any;
    if (result.type !== "GeometryCollection") {
      throw new Error("GeometryCollection parsing failed");
    }
  });

  // Test 10: Bounding box support
  await runTest("Point with bounding box", async () => {
    const pointWithBbox = {
      type: "Point",
      coordinates: [102.0, 0.5],
      bbox: [102.0, 0.5, 102.0, 0.5],
    };

    if (!isValidPoint(pointWithBbox)) {
      throw new Error("Point with bbox validation failed");
    }

    const result: any = await Effect.runPromise(
      parsePoint(pointWithBbox) as any,
    );
    if (!result.bbox || result.bbox.length !== 4) {
      throw new Error("Bbox not preserved");
    }
  });

  // Test 11: MultiPoint
  await runTest("Valid MultiPoint", async () => {
    const multiPointData = {
      type: "MultiPoint",
      coordinates: [
        [102.0, 0.5],
        [103.0, 1.0],
      ],
    };

    if (!isValidGeoJSON(multiPointData)) {
      throw new Error("MultiPoint validation failed");
    }

    const result = (await Effect.runPromise(
      parseGeoJSON(multiPointData) as any,
    )) as any;
    if (result.type !== "MultiPoint") {
      throw new Error("MultiPoint parsing failed");
    }
  });

  // Test 12: MultiPolygon
  await runTest("Valid MultiPolygon", async () => {
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

    if (!isValidGeoJSON(multiPolygonData)) {
      throw new Error("MultiPolygon validation failed");
    }

    const result = (await Effect.runPromise(
      parseGeoJSON(multiPolygonData) as any,
    )) as any;
    if (result.type !== "MultiPolygon") {
      throw new Error("MultiPolygon parsing failed");
    }
  });

  // Test 13: Invalid GeoJSON type
  await runTest("Invalid GeoJSON type", async () => {
    const invalidGeoJSON = {
      type: "InvalidType",
      coordinates: [102.0, 0.5],
    };

    if (isValidGeoJSON(invalidGeoJSON)) {
      throw new Error("Should not validate invalid GeoJSON type");
    }

    try {
      await Effect.runPromise(parseGeoJSON(invalidGeoJSON) as any);
      throw new Error("Should have thrown an error");
    } catch {
      // Expected to fail
    }
  });

  console.log("\n🎉 All tests passed!");
}

// Run tests
runAllTests().catch((error) => {
  console.error("\n💥 Test suite failed:", error);
  if (typeof process !== "undefined" && process.exit) {
    process.exit(1);
  }
});
