import {TFunction} from "i18next";

import {GetOutputPaymethods} from "@/api/requests";
import {formatThousands} from "@/utils";

export function getPlaceholder(
  payway: GetOutputPaymethods.Payway,
  t: TFunction,
) {
  return t("payway_text_two", {
    minAmount: formatThousands(payway.min_amount),
    maxAmount: formatThousands(payway.max_amount),
    currency: payway.currency,
  });
}

export function getHint(payway: GetOutputPaymethods.Payway, t: TFunction) {
  // Пример: Комиссия 3.5% + 50 RUB, мин: 300 RUB

  // Не показывать фикс комиссии, если фикс 0: "Комиссия 3.5% + 0 RUB" -> "Комиссия 3.5%"
  let comissionFormula = "";
  if (!payway.fix) {
    comissionFormula = t("payway_text_one", {amount: payway.percent});
  } else {
    comissionFormula = t("payway_text_one_with_fix", {
      amount: payway.percent,
      fixAmount: formatThousands(payway.fix),
      currency: payway.currency,
    });
  }

  // Не показывать минимальную комиссию, если она 0: ", мин: 0 RUB" -> ""
  let comissionMin = "";
  if (payway.min) {
    comissionMin = t("payway_text_one_with_fix_and_min", {
      amount: payway.percent,
      fixAmount: formatThousands(payway.fix),
      currency: payway.currency,
      minAmount: payway.min_amount,
    });
  }
  const limits = t("payway_text_two", {
    minAmount: formatThousands(payway.min_amount),
    maxAmount: formatThousands(payway.max_amount),
    currency: payway.currency,
  });

  return `${comissionFormula}${comissionMin}\n${limits}`;
}
