import {z} from "zod";

import {Currency, Locale} from "../shared";
import {GetPayments} from "./GetPayments";

export namespace GetPaymentDetails {
  export const METHOD = "GET";
  export const getURL = (id: number) => `demo/payments/${id}`;
  export const QUERY_KEY = "GetPaymentDetails";

  export type Params = {
    id: number;
    paymethod_type?: "account_transfer";
  };
  export const fields = [
    "id",
    "status",
    "created",
    "processed",
    "account",
    "receive_amount",
    "receive_currency",
    "receive_currency.alias",
    "write_off_amount",
    "write_off_currency",
    "write_off_currency.alias",
    "config",
    "rejected_reason",
  ];
  export type Fields = (typeof fields)[number];

  export const Schema = z.object({
    id: z.number(),
    status: z.nativeEnum(GetPayments.statusNameToStatusCodeMap),
    created: z.number(),
    processed: z.number().nullable(),
    shop_order_id: z.string().nullable().optional(),
    account: z.string().nullable(),
    receive_amount: z.number(),
    receive_currency: z.object({
      alias: Currency.AliasSchema,
    }),
    write_off_amount: z.number(),
    write_off_currency: z.object({
      alias: Currency.AliasSchema,
    }),
    config: z
      .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
      .nullable(),
    rejected_reason: Locale.localized(z.string()).nullable(),
  });

  export type Response = z.infer<typeof Schema>;
}
