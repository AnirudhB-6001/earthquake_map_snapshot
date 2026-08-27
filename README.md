# Earthquake Map Snapshot

A TypeScript command-line tool that fetches earthquake data from the USGS, validates and transforms it into GeoJSON, and writes a snapshot that GitHub can render as an interactive map.

## Example Map

[View the generated earthquake map](examples/earthquakes.geojson)

## Usage

Install dependencies and compile the TypeScript:

```bash
npm install
npm run build
```

Generate a GeoJSON snapshot:

```bash
node dist/index.js \
  --start 2026-08-18 \
  --end 2026-08-25 \
  --min-magnitude 5 \
  --output earthquakes.geojson
```

Required options:

- `--start` — start date in `YYYY-MM-DD` format
- `--end` — end date in `YYYY-MM-DD` format
- `--min-magnitude` — minimum earthquake magnitude from `0` to `10`
- `--output` — output path ending in `.geojson`

## Data Flow

The program follows this pipeline:

```text
CLI options
  ↓
USGS Earthquake API
  ↓
runtime validation of the response
  ↓
trusted internal earthquake records
  ↓
deterministic sorting
  ↓
GeoJSON Point features
  ↓
FeatureCollection
  ↓
.geojson file
  ↓
GitHub map rendering
```

USGS coordinates arrive as `[longitude, latitude, depth]`. The generated GeoJSON keeps `[longitude, latitude]` in each Point geometry and stores the depth separately as `depthKm`.

## Testing

Run the complete automated test suite with:

```bash
npm test
```

The test command compiles the TypeScript and checks:

- valid earthquake parsing
- deterministic multi-earthquake GeoJSON transformation
- empty valid responses
- malformed provider data rejection
- invalid CLI input
- non-success HTTP responses

## Example Snapshot

The committed example was generated from live USGS data with:

```bash
node dist/index.js \
  --start 2026-08-18 \
  --end 2026-08-25 \
  --min-magnitude 5 \
  --output examples/earthquakes.geojson
```

The resulting snapshot contains 45 earthquake features. GitHub recognizes the GeoJSON file and renders the points as an interactive map, clustering nearby earthquakes when zoomed out.

## Limitations

This project is intentionally small in scope:

- it makes a single request to the USGS Earthquake API
- it does not retry failed requests
- it does not implement pagination
- malformed required earthquake data causes the response to be rejected rather than partially accepted
- it generates static snapshots rather than a continuously updating map
- map visualization is provided by GitHub rather than by a custom frontend