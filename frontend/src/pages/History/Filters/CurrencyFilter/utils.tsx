import {TFunction} from "i18next";

import {Currency} from "@/api/requests";
import {Option} from "@/components/Select/Select";

import {FilterBill} from "../utils";

export function currencyCodeToOption(
  option: {
    code: "All" | Currency.Code;
    alias: "All" | Currency.Alias;
  },
  t: TFunction,
): Pick<
  Option<FilterBill["source_currency"]>,
  "title" | "subtitle" | "icon" | "iconNode"
> {
  if (option.code === "All") {
    return {
      title: t`all_currencies`,
      icon: {
        icon: "RegularLayers",
        bgColor: "grey-200 dark:bg-dark-surface",
        color: "grey-600 dark:text-dark-text-primary",
        testId: `history-currency-filter-select-icon-${option.code}`,
      },
    };
  }
  return {
    title:
      Currency.getRuName(option.code, t) || option.alias || `[${option.code}]`,
    subtitle: option.alias || "",
    icon: Currency.getIcon(option.alias)
      ? {
          icon: Currency.getIcon(option.alias)!,
          bgColor:
            Currency.getColor(option.alias) ?? "grey-200 dark:bg-dark-surface",
          color: "white dark:text-dark-bg",
          testId: `history-currency-filter-select-icon-${option.code}`,
        }
      : undefined,
    iconNode: !Currency.getIcon(option.alias) ? (
      <div className="flex size-10 items-center justify-center rounded-4 bg-grey-400 text-white dark:bg-dark-text-tertiary dark:text-dark-bg">
        {option.alias || option.code}
      </div>
    ) : undefined,
  };
}
