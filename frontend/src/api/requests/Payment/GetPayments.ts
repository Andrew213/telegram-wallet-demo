import {TFunction} from "i18next";
import {z} from "zod";

import {safeObjectValues} from "@/utils";

import {Currency} from "../shared";
export namespace GetPayments {
  export const METHOD = "GET";
  export const URL = "demo/payments";
  export const QUERY_KEY = "GetPayments";

  export const statusNameToStatusCodeMap = {
    Waiting: 3,
    Successful: 5,
    Rejected: 6,
    Refunded: 11,
  } as const;

  export const statusCodeToStatusNameMap = {
    3: "Waiting",
    5: "Successful",
    6: "Rejected",
    11: "Refunded",
  } as const;

  export const statusCodeToStatusRuNameMap = (t: TFunction) =>
    ({
      3: t("statuses.waiting"),
      5: t("statuses.successful"),
      6: t("statuses.rejected"),
      11: t("statuses.refunded"),
    }) as const;

  export const statusNames = safeObjectValues(statusCodeToStatusNameMap);
  export type StatusName = (typeof statusNames)[number];

  export const statusCodes = safeObjectValues(statusNameToStatusCodeMap);
  export type StatusCode = (typeof statusCodes)[number];

  export type Params = {
    id?: number;
    last_id?: number;
    created_from?: number;
    created_to?: number;
    source_currency?: Currency.Code;
    target_currency?: Currency.Code;
    account?: string;
    paymethod_id?: number;
    status?: StatusCode;
    limit?: number;
  };

  const PaymentSchema = z.object({
    id: z.number(),
    created: z.number(),
    receive_amount: z.number(),
    receive_currency: Currency.AliasSchema,
    write_off_amount: z.number(),
    write_off_currency: Currency.AliasSchema,
    account: z.string(),
    is_account_transfer: z.boolean(),
    paymethod_id: z.number(),
    status: z.nativeEnum(statusNameToStatusCodeMap),
  });
  export type Payment = z.infer<typeof PaymentSchema>;

  export const Schema = z.array(PaymentSchema);
  export type Response = z.infer<typeof Schema>;
}
