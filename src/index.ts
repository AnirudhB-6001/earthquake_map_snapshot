import { writeFile } from "node:fs/promises";

import {
  compareEarthquakes,
  earthquakeToFeature,
  featuresToCollection,
  parseProviderResponse,
} from "./core.js";

type CliOptions = {
  start: string;
  end: string;
  minMagnitude: number;
  output: string;
};

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseCliOptions(args: string[]): CliOptions {
  let start: string | undefined;
  let end: string | undefined;
  let minMagnitude: number | undefined;
  let output: string | undefined;

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    if (value === undefined) {
      throw new Error(`Missing value for ${flag}`);
    }

    if (flag === "--start") {
      start = value;
    } else if (flag === "--end") {
      end = value;
    } else if (flag === "--min-magnitude") {
      minMagnitude = Number(value);
    } else if (flag === "--output") {
      output = value;
    } else {
      throw new Error(`Unknown option: ${flag}`);
    }
  }

  if (
    start === undefined ||
    end === undefined ||
    minMagnitude === undefined ||
    output === undefined
  ) {
    throw new Error("Missing required CLI option");
  }

  if (!isRealDate(start)) {
  throw new Error("--start must be a valid date in YYYY-MM-DD format");
}

if (!isRealDate(end)) {
  throw new Error("--end must be a valid date in YYYY-MM-DD format");
}

if (start >= end) {
  throw new Error("--start must be before --end");
}

if (!Number.isFinite(minMagnitude) || minMagnitude < 0 || minMagnitude > 10) {
  throw new Error("--min-magnitude must be a finite number from 0 through 10");
}

if (!output.endsWith(".geojson")) {
  throw new Error("--output must end with .geojson");
}

  return {
    start,
    end,
    minMagnitude,
    output,
  };
}

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

async function fetchProviderResponse(options: CliOptions): Promise<unknown> {

    const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");

    url.searchParams.set("format", "geojson");
    url.searchParams.set("starttime", options.start);
    url.searchParams.set("endtime", options.end);
    url.searchParams.set("minmagnitude", String(options.minMagnitude));
    url.searchParams.set("eventtype", "earthquake");

    const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`USGS request failed with status ${response.status}`);
  }

  return response.json();
}

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