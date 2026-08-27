import { writeFile } from "node:fs/promises";

import {
  compareEarthquakes,
  earthquakeToFeature,
  featuresToCollection,
  parseProviderResponse,
} from "./core.js";

import { parseCliOptions } from "./cli.js";
import type { CliOptions } from "./cli.js";

import { fetchProviderResponse } from "./api.js";

const providerResponse: unknown = {
  type: "FeatureCollection",
  features: [
  {
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
  },
  {
    id: "example-2",
    properties: {
      mag: 6.1,
      place: "Second example earthquake",
      time: 1787643000000,
      url: "https://example.com/earthquake/example-2",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.4, 37.8, 8],
    },
  },
  ],
};


async function main() {

    const options = parseCliOptions(process.argv.slice(2));
    console.log(options);

  const liveResponse = await fetchProviderResponse(options);

  const earthquakes = parseProviderResponse(liveResponse);

  const sortedEarthquakes = [...earthquakes].sort(compareEarthquakes);

  const features = sortedEarthquakes.map(earthquakeToFeature);

  const featureCollection = featuresToCollection(features);

  const output = JSON.stringify(featureCollection, null, 2) + "\n";

  await writeFile(options.output, output, "utf8");

  console.log(`Wrote ${options.output}`);
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error("Error: Unknown failure");
  }

  process.exitCode = 1;
});