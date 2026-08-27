import test from "node:test";
import assert from "node:assert/strict";

import { fetchProviderResponse } from "../dist/api.js";

test("rejects a non-success HTTP response", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () =>
    new Response("", {
      status: 503,
      statusText: "Service Unavailable",
    });

  try {
    await assert.rejects(() =>
      fetchProviderResponse({
        start: "2026-08-18",
        end: "2026-08-25",
        minMagnitude: 5,
        output: "test.geojson",
      }),
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});