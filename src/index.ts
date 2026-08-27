type Earthquake = {
    id: string;
    magnitude: number;
    place: string;
    occurredAt: string;
    depthKm: number;
    sourceUrl: string;
    longitude: number;
    latitude: number;
};

const providerFeature: unknown = {
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

console.log(providerFeature);
if (typeof providerFeature === "object" && providerFeature !== null) {
    console.log("providerFeature is an object");
}

function parseEarthquake(value: unknown): Earthquake {
    if (typeof value !== "object" || value === null) {
        throw new Error("Earthquake feature must be an object");
    }

    if (!("id" in value) || typeof value.id !== "string") {
        throw new Error("Earthquake feature must have a string id");
    }

    if (
        !("properties" in value) ||
        typeof value.properties !== "object" ||
        value.properties === null
    ) {
        throw new Error("Earthquake feature must have a properties object");
    }

    const properties = value.properties;

    if (
        !("mag" in properties) ||
        typeof properties.mag !== "number" ||
        !Number.isFinite(properties.mag)
    ) {
        throw new Error("Earthquake magnitude must be a finite number");
    }

    if (!("place" in properties) || typeof properties.place !== "string") {
        throw new Error("Earthquake place must be a string");
    }

    if (
        !("time" in properties) ||
        typeof properties.time !== "number" ||
        !Number.isFinite(properties.time)
    ) {
        throw new Error("Earthquake time must be a finite number");
    }

    if (!("url" in properties) || typeof properties.url !== "string") {
        throw new Error("Earthquake URL must be a string");
    }

    if (
        !("geometry" in value) ||
        typeof value.geometry !== "object" ||
        value.geometry === null
    ) {
        throw new Error("Earthquake feature must have a geometry object");
    }

    const geometry = value.geometry;

    if (!("type" in geometry) || geometry.type !== "Point") {
        throw new Error("Earthquake geometry must be a Point");
    }

    if (!("coordinates" in geometry) || !Array.isArray(geometry.coordinates)) {
        throw new Error("Earthquake geometry must have coordinates");
    }

    const coordinates = geometry.coordinates;

    if (coordinates.length < 3) {
        throw new Error("Earthquake coordinates must include longitude, latitude, and depth");
    }

    const [longitude, latitude, depthKm] = coordinates;

    if (
        typeof longitude !== "number" ||
        !Number.isFinite(longitude) ||
        typeof latitude !== "number" ||
        !Number.isFinite(latitude) ||
        typeof depthKm !== "number" ||
        !Number.isFinite(depthKm)
    ) {
        throw new Error("Earthquake coordinates must be finite numbers");
    }

    if (longitude < -180 || longitude > 180) {
        throw new Error("Earthquake longitude is out of range");
    }

    if (latitude < -90 || latitude > 90) {
        throw new Error("Earthquake latitude is out of range");
    }

    const occurredAt = new Date(properties.time);

    if (Number.isNaN(occurredAt.getTime())) {
        throw new Error("Earthquake time must be a valid timestamp");
    }

    return {
        id: value.id,
        magnitude: properties.mag,
        place: properties.place,
        occurredAt: occurredAt.toISOString(),
        depthKm,
        sourceUrl: properties.url,
        longitude,
        latitude,
    };
}

function earthquakeToFeature(earthquake: Earthquake) {
  return {
    type: "Feature",
    properties: {
      id: earthquake.id,
      magnitude: earthquake.magnitude,
      place: earthquake.place,
      occurredAt: earthquake.occurredAt,
      depthKm: earthquake.depthKm,
      sourceUrl: earthquake.sourceUrl,
    },
    geometry: {
      type: "Point",
      coordinates: [earthquake.longitude, earthquake.latitude],
    },
  };
}

const earthquake = parseEarthquake(providerFeature);

const feature = earthquakeToFeature(earthquake);

console.log(feature);

console.log(earthquake);