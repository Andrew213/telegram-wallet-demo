import {TFunction} from "i18next";
import {z} from "zod";

import {Currency} from "../shared";

export namespace GetDeposit {
  export const METHOD = "GET";
  export const URL = "demo/deposit";
  export const QUERY_KEY = "GetDeposit";

  export const errorCodeToErrorTextMap = (t: TFunction) =>
    ({
      1: t`deposit_errors.pay_way_not_found`,
      2: t`deposit_errors.pay_way_is_not_active`,
      4: t`deposit_errors.amount_too_small`,
      5: t`deposit_errors.amount_too_large`,
      10: t`common_errors.incorrect_data`,
      13: t`deposit_errors.account_is_not_found`,
      14: t`deposit_errors.account_is_not_active`,
      16: t`payment_errors.exchange_is_not_available`,
      23: t`deposit_errors.daily_limit_exceeds`,
      27: t`deposit_errors.limit_exceeds`,
    }) as const;

  export const nativeErrorCodes = [41];

  export type Params = {
    amount: number;
    currency: Currency.Code;
    paymethod_id: number;
    payer_currency: Currency.Code;
  };

  export const Schema = z.object({
    amount: z.number(),
    commission: z.number(),
    currency: Currency.AliasSchema,
    rate: z.number(),
  });

  export type Response = z.infer<typeof Schema>;
}
