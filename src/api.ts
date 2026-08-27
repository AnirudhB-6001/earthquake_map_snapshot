import type { CliOptions } from "./cli.js";

export async function fetchProviderResponse(options: CliOptions): Promise<unknown> {

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