import {TFunction} from "i18next";
import {z} from "zod";

import {safeObjectValues} from "@/utils";

import {Currency} from "../shared";

export namespace GetBills {
  export const METHOD = "GET";
  export const URL = "demo/bills";
  export const QUERY_KEY = "GetBills";

  export const statusNameToStatusCodeMap = {
    Waiting: 1,
    Successful: 2,
    Rejected: 3,
    Expired: 4,
  } as const;

  export const statusCodeToStatusNameMap = {
    1: "Waiting",
    2: "Successful",
    3: "Rejected",
    4: "Expired",
  } as const;

  export const statusCodeToStatusRuNameMap = (t: TFunction) =>
    ({
      1: t("statuses.waiting"),
      2: t("statuses.successful"),
      3: t("statuses.rejected"),
      4: t("statuses.expired"),
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
    shop_order_id?: number;
    source_currency?: Currency.Code;
    target_currency?: Currency.Code;
    account?: string;
    status?: StatusCode;
    limit?: number;
  };

  const BillSchema = z.object({
    id: z.number(),
    created: z.number(),
    expired: z.number(),
    shop_order_id: z.string().nullable(),
    account: z.string(),
    receive_amount: z.number(),
    receive_currency: z.union([
      z.object({
        alias: Currency.AliasSchema,
      }),
      Currency.AliasSchema,
    ]),
    write_off_amount: z.number(),
    write_off_currency: z.union([
      z.object({
        alias: Currency.AliasSchema,
      }),
      Currency.AliasSchema,
    ]),
    status: z.nativeEnum(statusNameToStatusCodeMap),
    encoded_id: z.string(),
  });
  export type Bill = z.infer<typeof BillSchema>;

  export const Schema = z.array(BillSchema);
  export type Response = z.infer<typeof Schema>;
}
