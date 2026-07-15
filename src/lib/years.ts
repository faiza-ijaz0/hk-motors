export const EARLIEST_VEHICLE_YEAR = 1880;

/** Descending list from next year (to allow for early model-year releases) down to 1880. */
export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const length = currentYear + 1 - EARLIEST_VEHICLE_YEAR + 1;
  return Array.from({ length }, (_, i) => currentYear + 1 - i);
}
