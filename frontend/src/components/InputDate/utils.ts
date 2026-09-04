import {TFunction} from "i18next";

import {monthKeys} from "./constants";

export const getMonthName = (date: Date, t: TFunction) => {
  const monthIndex = date.getMonth();
  return t(`monthNames.${monthKeys[monthIndex]}`);
};

export const getDayNames = (day: string, t: TFunction) => {
  return t(`dayNamesShort.${day.toLowerCase()}`);
};
