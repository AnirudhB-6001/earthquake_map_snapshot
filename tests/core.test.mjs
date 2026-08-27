import test from "node:test";
import assert from "node:assert/strict";

import {
  compareEarthquakes,
  parseProviderResponse,
  earthquakeToFeature,
  featuresToCollection,
  parseEarthquake,
} from "../dist/core.js";

test("parses one valid earthquake", () => {
  const providerFeature = {
    id: "example-1",
    properties: {
      mag: 5.4,
      place: "Example earthquake",
      time: 1787639400000,
      url: "https://example.com/earthquake/example-1",
    },
    geometry: {
      type: "Point",
      coordinates: [142.3, 38.1, 12],
    },
  };

  const earthquake = parseEarthquake(providerFeature);

  assert.equal(earthquake.id, "example-1");
  assert.equal(earthquake.magnitude, 5.4);
  assert.equal(earthquake.longitude, 142.3);
  assert.equal(earthquake.latitude, 38.1);
  assert.equal(earthquake.depthKm, 12);
});

test("transforms multiple earthquakes into deterministic GeoJSON", () => {
  const providerFeatures = [
    {
      id: "older",
      properties: {
        mag: 5.4,
        place: "Older earthquake",
        time: 1787639400000,
        url: "https://example.com/older",
      },
      geometry: {
        type: "Point",
        coordinates: [142.3, 38.1, 12],
      },
    },
    {
      id: "newer",
      properties: {
        mag: 6.1,
        place: "Newer earthquake",
        time: 1787643000000,
        url: "https://example.com/newer",
      },
      geometry: {
        type: "Point",
        coordinates: [-122.4, 37.8, 8],
      },
    },
  ];

  const earthquakes = providerFeatures.map(parseEarthquake);
  const sorted = [...earthquakes].sort(compareEarthquakes);
  const features = sorted.map(earthquakeToFeature);
  const collection = featuresToCollection(features);

  assert.equal(collection.features[0].properties.id, "newer");
  assert.equal(collection.features[0].properties.magnitude, 6.1);
  assert.deepEqual(collection.features[0].geometry.coordinates, [-122.4, 37.8]);
  assert.equal(collection.features[1].properties.id, "older");
});

test("produces an empty FeatureCollection for an empty valid response", () => {
  const providerResponse = {
    type: "FeatureCollection",
    features: [],
  };

  const earthquakes = parseProviderResponse(providerResponse);
  const features = earthquakes.map(earthquakeToFeature);
  const collection = featuresToCollection(features);

  assert.deepEqual(collection, {
    type: "FeatureCollection",
    features: [],
  });
});