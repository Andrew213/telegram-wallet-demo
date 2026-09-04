import {TFunction} from "i18next";
import {z} from "zod";

import {safeObjectValues} from "@/utils";

import {Currency} from "../shared";

export namespace GetDeposits {
  export const METHOD = "GET";
  export const URL = "demo/deposits";
  export const QUERY_KEY = "GetDeposits";

  export const statusNameToStatusCodeMap = {
    Waiting: 2,
    Successful: 4,
    Rejected: 6,
    Blocked: 7,
    Refunded: 8,
    Held: 9,
  } as const;
  export const statusCodeToStatusNameMap = {
    2: "Waiting",
    4: "Successful",
    6: "Rejected",
    7: "Blocked",
    8: "Refunded",
    9: "Held",
  } as const;

  export const statusCodeToStatusRuNameMap = (t: TFunction) =>
    ({
      2: t("statuses.waiting"),
      4: t("statuses.successful"),
      6: t("statuses.rejected"),
      7: t("statuses.blocked"),
      8: t("statuses.refunded"),
      9: t("statuses.held"),
      unknown: t("statuses.unknown"),
    }) as const;

  export const statusNames = safeObjectValues(statusCodeToStatusNameMap);
  export type StatusName = (typeof statusNames)[number];

  export const statusCodes = safeObjectValues(statusNameToStatusCodeMap);
  export type StatusCode = (typeof statusCodes)[number];

  const paymethodTypes = ["account_transfer", "transfer", "deposit"] as const;
  export type PaymethodType = (typeof paymethodTypes)[number];

  export type Params = {
    id?: number;
    last_id?: number;
    created_from?: number;
    created_to?: number;
    shop_order_id?: number;
    source_currency?: Currency.Code;
    target_currency?: Currency.Code;
    account?: string;
    paymethod_id?: number;
    status?: StatusCode;
    limit?: number;
  };

  const DepositSchema = z.object({
    id: z.number(),
    created: z.number(),
    shop_order_id: z.string().nullable(),
    account: z.string().nullable(),
    paymethod_id: z.number(),
    paymethod_type: z.enum(paymethodTypes),
    receive_amount: z.number(),
    receive_currency: Currency.AliasSchema,
    write_off_amount: z.number(),
    write_off_currency: Currency.AliasSchema,
    status: z.nativeEnum(statusNameToStatusCodeMap),
  });
  export type Deposit = z.infer<typeof DepositSchema>;

  export const Schema = z.array(DepositSchema);
  export type Response = z.infer<typeof Schema>;
}
