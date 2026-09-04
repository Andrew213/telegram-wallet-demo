import {TFunction} from "i18next";

import {
  addDays,
  formateDate,
  isValidDate,
  truncateToEndOfDay,
  truncateToStartOfDay,
  truncateToStartOfMonth,
} from "@/utils";

export type DatePeriod = "All" | "Today" | "Yesterday" | "Month";
export const datePeriodToNameRuMap = (
  t: TFunction,
): Record<DatePeriod, string> => ({
  Today: t`today`,
  Yesterday: t`yesterday`,
  Month: t`month`,
  All: t`all_time`,
});

export const datePeriods: DatePeriod[] = ["Today", "Yesterday", "Month", "All"];

export function datePeriodToDates(
  datePeriod: Exclude<DatePeriod, "All">,
): [Date, Date] {
  switch (datePeriod) {
    case "Today": {
      const now = new Date();
      return [truncateToStartOfDay(now), truncateToEndOfDay(now)];
    }
    case "Yesterday": {
      const now = new Date();
      const yesterday = addDays(now, -1);
      return [truncateToStartOfDay(yesterday), truncateToEndOfDay(yesterday)];
    }
    case "Month": {
      const now = new Date();
      return [truncateToStartOfMonth(now), truncateToEndOfDay(now)];
    }
  }
}

export function datesToInputValue(
  locale: string,
  dates?: [Date, Date],
): string {
  if (!dates) {
    return "";
  }

  return `${formateDate(dates[0], locale)} - ${formateDate(dates[1], locale)}`;
}

export function parseDates(value: string): [Date, Date] {
  const dates = value.split("-");
  if (dates.length !== 2) {
    throw new Error("");
  }

  const [startDate, endDate] = [
    parseDate(dates[0].trim()),
    parseDate(dates[1].trim()),
  ];

  if (startDate > endDate) {
    throw new Error("");
  }

  return [truncateToStartOfDay(startDate), truncateToEndOfDay(endDate)];
}

function parseDate(dateString: string) {
  const parts = dateString.split(".").map(Number);
  if (parts.length !== 3 || parts.some(part => Number.isNaN(part))) {
    throw new Error("");
  }
  const [day, month, year] = parts;
  const date = new Date(year, month - 1, day);
  if (!isValidDate(date)) {
    throw new Error("");
  }

  return date;
}
