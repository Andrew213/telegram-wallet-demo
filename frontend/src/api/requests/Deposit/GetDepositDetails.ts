import {z} from "zod";

import {Currency} from "../shared";
import {GetDeposits} from "./GetDeposits";

export namespace GetDepositDetails {
  export const METHOD = "GET";
  export const getURL = (id: number) => `demo/deposits/${id}`;
  export const QUERY_KEY = "GetDepositDetails";

  export type Params = {
    id: number;
    paymethod_type: GetDeposits.PaymethodType;
  };
  export const fields = [
    "id",
    "status",
    "created",
    "processed",
    "shop_order_id",
    "account",
    "receive_amount",
    "receive_currency",
    "receive_currency.alias",
    "write_off_amount",
    "write_off_currency",
    "write_off_currency.alias",
    "config",
  ];
  export type Fields = (typeof fields)[number];

  export const Schema = z.object({
    id: z.number(),
    status: z.nativeEnum(GetDeposits.statusNameToStatusCodeMap),
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
    additional_data: z
      .object({
        bank: z.nullable(z.string()),
        receipt_url: z.nullable(z.string()),
        requisites: z.nullable(z.string()),
      })
      .nullable(),
  });

  export type Response = z.infer<typeof Schema>;
}
