export type CliOptions = {
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

export function parseCliOptions(args: string[]): CliOptions {
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