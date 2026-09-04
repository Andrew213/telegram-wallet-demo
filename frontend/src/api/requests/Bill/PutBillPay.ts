import {TFunction} from "i18next";
import {z} from "zod";

import {Currency} from "../shared";

export namespace PutBillPay {
  export const METHOD = "PUT";
  export const getUrl = (encoded_bill_id: string) =>
    `demo/bills/${encoded_bill_id}/pay`;

  export const errorCodeToErrorTextMap = (t: TFunction) => ({
    3: t`bill_errors.pay_way_not_found`,
    7: t`bill_errors.operation_no_found`,
    9: t`bill_errors.insufficient_balance`,
    13: t`bill_errors.account_is_not_found`,
    14: t`bill_errors.account_is_not_active`,
    16: t`bill_errors.invalid_currency`,
    32: t`bill_errors.restricted_account`,
  });

  export type Params = {
    currency?: Currency.Code;
    encoded_bill_id: string;
  };

  export const Schema = z.object({
    shop_url: z.string().nullable().optional(),
  });
  export type Response = z.infer<typeof Schema>;
}
