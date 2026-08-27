import test from "node:test";
import assert from "node:assert/strict";

import { parseCliOptions } from "../dist/cli.js";

test("rejects invalid CLI input", () => {
  assert.throws(() => {
    parseCliOptions([
      "--start",
      "2026-02-31",
      "--end",
      "2026-03-10",
      "--min-magnitude",
      "5",
      "--output",
      "invalid.geojson",
    ]);
  });
});