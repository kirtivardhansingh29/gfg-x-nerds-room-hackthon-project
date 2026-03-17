const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const standardNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function humanizeLabel(label) {
  if (!label) {
    return "Metric";
  }

  return String(label)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatCompactNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  if (typeof value !== "number") {
    return String(value);
  }

  return compactNumberFormatter.format(value);
}

function formatPercentage(value) {
  if (Math.abs(value) <= 1) {
    return `${(value * 100).toFixed(1)}%`;
  }

  return `${standardNumberFormatter.format(value)}%`;
}

function shouldFormatAsCurrency(label = "") {
  const lowered = label.toLowerCase();
  return ["revenue", "sales", "spend", "amount", "price", "cost", "profit", "gmv", "income"].some(
    (token) => lowered.includes(token)
  );
}

function shouldFormatAsPercentage(label = "") {
  const lowered = label.toLowerCase();
  return ["percent", "percentage", "share", "rate", "ratio", "pct"].some((token) =>
    lowered.includes(token)
  );
}

export function formatMetricValue(value, label = "") {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  if (typeof value !== "number") {
    return String(value);
  }

  if (shouldFormatAsPercentage(label)) {
    return formatPercentage(value);
  }

  if (shouldFormatAsCurrency(label)) {
    return Math.abs(value) >= 1000
      ? compactCurrencyFormatter.format(value)
      : currencyFormatter.format(value);
  }

  if (Math.abs(value) >= 100000) {
    return compactNumberFormatter.format(value);
  }

  return standardNumberFormatter.format(value);
}

export function formatCellValue(value, label = "") {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  if (typeof value === "number") {
    return formatMetricValue(value, label);
  }

  if (value instanceof Date) {
    return dateTimeFormatter.format(value);
  }

  const stringValue = String(value);
  const parsedDate = new Date(stringValue);
  if (!Number.isNaN(parsedDate.getTime()) && /[-/:T]/.test(stringValue)) {
    return dateTimeFormatter.format(parsedDate);
  }

  return stringValue;
}

export function formatTimestamp(value) {
  if (!value) {
    return "Just now";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return dateTimeFormatter.format(parsedDate);
}

export function formatRelativeTime(value) {
  if (!value) {
    return "Pending";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  const diffInSeconds = Math.round((parsedDate.getTime() - Date.now()) / 1000);
  const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const ranges = [
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const range of ranges) {
    if (Math.abs(diffInSeconds) >= range.seconds || range.unit === "minute") {
      return relativeFormatter.format(Math.round(diffInSeconds / range.seconds), range.unit);
    }
  }

  return "Just now";
}
