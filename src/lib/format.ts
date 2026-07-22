export function formatPrice(price: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currencyCode} ${price.toLocaleString()}`;
  }
}

export function formatMileage(mileage: number) {
  return `${mileage.toLocaleString()} km`;
}

/** Employee/payroll figures are stored without a currency code (single
 * company payroll, not per-record like car listings) — PKR fits the
 * CNIC-based employee identity fields already in the schema. */
export function formatSalary(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats a Postgres `time` string ("09:00:00" / "09:00") as "9:00 AM". */
export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

export function formatRelativeTime(date: string) {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;

  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return relativeFormatter.format(
        Math.round(seconds / secondsInUnit),
        unit,
      );
    }
  }

  return relativeFormatter.format(Math.round(seconds), "second");
}
