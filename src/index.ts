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


async function main() {

  const options = parseCliOptions(process.argv.slice(2));

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