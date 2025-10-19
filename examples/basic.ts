import { Effect } from "effect";
import {
	isValidGeoJSON,
	parseFeature,
	parseGeoJSON,
	parsePoint,
} from "../src/index.js";

// Example 1: Basic Point validation
const pointData = {
	type: "Point",
	coordinates: [102.0, 0.5],
};

console.log("=== Point Validation ===");
console.log("Is valid GeoJSON:", isValidGeoJSON(pointData));

// Example 2: Parse Point with Effect
const parsePointExample = async () => {
	try {
		const result = await Effect.runPromise(parsePoint(pointData) as any);
		console.log("Parsed Point:", result);
	} catch (error) {
		console.error("Parse error:", error);
	}
};

// Example 3: Feature with properties
const featureData = {
	type: "Feature",
	geometry: {
		type: "Point",
		coordinates: [102.0, 0.5],
	},
	properties: {
		name: "Sample Location",
		category: "landmark",
		population: 1000,
	},
	id: "location-001",
};

console.log("\n=== Feature Validation ===");
console.log("Is valid GeoJSON:", isValidGeoJSON(featureData));

// Example 4: FeatureCollection
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
				name: "Location 1",
			},
		},
		{
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: [
					[102.0, 0.0],
					[103.0, 1.0],
					[104.0, 0.0],
				],
			},
			properties: {
				name: "Route 1",
				length: 150.5,
			},
		},
	],
};

// Example 5: Polygon with hole
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

// Example 6: GeometryCollection
const geometryCollection = {
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
	],
};

// Example 7: Error handling with invalid data
const invalidData = {
	type: "Point",
	coordinates: "invalid", // Should be an array
};

const handleErrorExample = async () => {
	console.log("\n=== Error Handling Example ===");

	const program = parseGeoJSON(invalidData).pipe(
		Effect.catchAll((error: any) => {
			console.error("Validation failed:", error.message);
			return Effect.succeed(null);
		}) as any,
	);

	const result = await Effect.runPromise(program);
	console.log("Result after error handling:", result);
};

// Example 8: Bounding box support
const pointWithBbox = {
	type: "Point",
	coordinates: [102.0, 0.5],
	bbox: [102.0, 0.5, 102.0, 0.5], // [west, south, east, north]
};

// Run all examples
async function runExamples() {
	await parsePointExample();

	console.log("\n=== FeatureCollection Validation ===");
	console.log("Is valid GeoJSON:", isValidGeoJSON(featureCollectionData));

	console.log("\n=== Complex Geometries ===");
	console.log("Polygon with hole is valid:", isValidGeoJSON(polygonWithHole));
	console.log(
		"GeometryCollection is valid:",
		isValidGeoJSON(geometryCollection),
	);
	console.log("Point with bbox is valid:", isValidGeoJSON(pointWithBbox));

	await handleErrorExample();

	// Example 9: Parse and work with the result
	console.log("\n=== Working with parsed results ===");
	try {
		const parsedFeature: any = await Effect.runPromise(
			parseFeature(featureData) as any,
		);
		console.log("Feature name:", parsedFeature.properties?.name);
		if (
			parsedFeature.geometry &&
			(parsedFeature.geometry as any).type === "Point"
		) {
			console.log(
				"Feature coordinates:",
				(parsedFeature.geometry as any).coordinates,
			);
		}
	} catch (error) {
		console.error("Failed to parse feature:", error);
	}
}

runExamples().catch(console.error);
