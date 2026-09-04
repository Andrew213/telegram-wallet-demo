/**
 * This function works in local time, meaning it will respect the user's local time zone.
 * It sets the time to the very beginning of the day (00:00:00.000), effectively truncating the date to the start of the day.
 * @param date Date
 * @returns
 */
export function truncateToStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * The time is set to 23:59:59.999, which is the very last millisecond of the day in local time.
 * The function respects the user's local time zone.
 * @param date Date
 * @returns
 */
export function truncateToEndOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

/**
 * This function truncates a date to the first day of the month, with the time set to 00:00:00.000.
 * It respects the local time zone, meaning the result is localized to the user's current time zone.
 * @param date Date
 * @returns
 */
export function truncateToStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * @param date Date
 * @param days - Amount of days to add (to subtract)
 */
export function addDays(date: Date, days: number): Date {
  const copyDate = new Date(date.valueOf());
  copyDate.setDate(copyDate.getDate() + days);
  return copyDate;
}

export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(+date);
}
