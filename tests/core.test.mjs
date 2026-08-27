import test from "node:test";
import assert from "node:assert/strict";

import { parseEarthquake } from "../dist/core.js";

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