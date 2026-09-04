import {TFunction} from "i18next";
import {z} from "zod";

import {Currency} from "../shared";

export namespace GetPayment {
  export const METHOD = "GET";
  export const URL = "demo/payment";
  export const QUERY_KEY = "GetPayment";

  export const errorCodeToErrorTextMap = (t: TFunction) =>
    ({
      1: t`payment_errors.pay_way_not_found`,
      2: t`payment_errors.pay_way_is_not_active`,
      3: t`payment_errors.exchange_is_not_available`,
      4: t`payment_errors.amount_too_small`,
      5: t`payment_errors.amount_too_large`,
      9: t`payment_errors.insufficient_balance`,
      10: t`common_errors.incorrect_data`,
      14: t`payment_errors.account_is_not_active`,
      16: t`payment_errors.exchange_is_not_available`,
      22: t`payment_errors.balance_is_missing`,
      25: t`payment_errors.zero`,
      26: t`payment_errors.less_then_zero`,
      27: t`payment_errors.day_shop_limit`,
      32: t`payment_errors.restricted_account`,
      33: t`payment_errors.week_shop_limit`,
      34: t`payment_errors.month_shop_limit`,
    }) as const;

  export const nativeErrorCodes = [41];

  export type Params = {
    amount: number;
    amount_type: "receive" | "write_off";
    source_currency: Currency.Code;
    target_currency?: Currency.Code;
  } & (
    | {
        paymethod_type: "bill";
        shop_id: number;
        shop_order_id: number;
      }
    | {
        paymethod_type: "payout";
        paymethod_id: number;
      }
    | {
        paymethod_type: "account_transfer";
      }
  );

  export type Response = z.infer<typeof Schema>;

  export const Schema = z.object({
    receive_amount: z.number(),
    write_off_amount: z.number(),
  });
}
