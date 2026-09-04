import i18n from "@/i18";

const intlThousands = new Intl.NumberFormat("ru-RU");
const intlThousandsWithDecimals = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatCache: {[locale: string]: Intl.DateTimeFormat} = {};

function getMonthName(monthIndex: number): string {
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  return monthNames[monthIndex];
}

type DateParts = {
  [key in "day" | "month" | "year" | "hour" | "minute" | "second"]?: string;
};

export function formatDateFromTimestamp(timestamp: number, locale: string) {
  const date = new Date(timestamp);
  if (!dateFormatCache[locale]) {
    dateFormatCache[locale] = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  const formatter = dateFormatCache[locale];
  const formattedDateParts = formatter.formatToParts(date);
  const dateParts: DateParts = formattedDateParts.reduce((acc, part) => {
    if (
      part.type === "day" ||
      part.type === "month" ||
      part.type === "year" ||
      part.type === "hour" ||
      part.type === "minute" ||
      part.type === "second"
    ) {
      acc[part.type] = part.value;
    }
    return acc;
  }, {} as DateParts);
  const {
    day,
    month,
    year,
    hour: hours,
    minute: minutes,
    second: seconds,
  } = dateParts;

  return {day, month, year, hours, minutes, seconds};
}

export function formatThousands(
  number: number | bigint,
  options?: {decimals?: boolean},
) {
  if (options?.decimals) {
    return intlThousandsWithDecimals.format(number).replace(",", ".");
  }
  if (!options?.decimals) {
    return intlThousands.format(number);
  }
  return intlThousandsWithDecimals.format(number).replace(",", ".");
}

export function formateDate(
  date: Date | number,
  locale: string,
  options?: {long?: boolean; time?: boolean},
) {
  const {long = false, time = false} = options ?? {};

  if (long) {
    const day = new Date(date).getDate();
    const monthIndex = new Date(date).getMonth();
    const year = new Date(date).getFullYear();

    const monthNameKey = `monthNames.${getMonthName(monthIndex)}`;
    const monthName = i18n.t(monthNameKey);

    const formattedDate = `${day} ${monthName} ${year}`;
    const timeComponent = time
      ? new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
        }).format(date)
      : null;
    return [formattedDate, timeComponent].filter(Boolean).join(" ");
  } else {
    const dateIntlShort = new Intl.DateTimeFormat(locale, {
      // Use passed locale
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const timeIntl = new Intl.DateTimeFormat(locale, {
      // Use passed locale
      hour: "2-digit",
      minute: "2-digit",
    });
    return [dateIntlShort.format(date), time && timeIntl.format(date)]
      .filter(v => v !== false)
      .join(" ");
  }
}

export const formatStringToUuid = async (input: string) => {
  // Преобразуем строку в массив байтов
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Создаем хэш (SHA-1)
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  // Форматируем хэш как GUID
  return [
    hashHex.substring(0, 8),
    hashHex.substring(8, 12),
    "4" + hashHex.substring(13, 16), // Версия 4
    ((parseInt(hashHex[16], 16) & 0x3) | 0x8).toString(16) +
      hashHex.substring(17, 20), // Версия GUID
    hashHex.substring(20, 32),
  ].join("-");
};
