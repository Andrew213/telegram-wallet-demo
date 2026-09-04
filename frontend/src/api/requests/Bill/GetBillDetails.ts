import {z} from "zod";

import {Currency} from "../shared";
import {GetBills} from "./GetBills";

export namespace GetBillDetails {
  export const METHOD = "GET";
  export const getURL = (id: number) => `demo/bills/${id}`;
  export const QUERY_KEY = "GetBillDetails";

  export type Params = {
    id: number;
  };
  export const fields = [
    "id",
    "status",
    "created",
    "processed",
    "expired",
    "shop_order_id",
    "account",
    "receive_amount",
    "receive_currency",
    "receive_currency.code",
    "receive_currency.alias",
    "write_off_amount",
    "write_off_currency",
    "write_off_currency.alias",
    "write_off_currency.code",
    "shop",
    "shop.id",
    "shop.name",
  ];
  export type Fields = (typeof fields)[number];

  export const Schema = z.object({
    id: z.number(),
    status: z.nativeEnum(GetBills.statusNameToStatusCodeMap),
    created: z.number(),
    processed: z.number().nullable(),
    expired: z.number().nullable(),
    shop_order_id: z.string().nullable().optional(),
    account: z.string().nullable(),
    receive_amount: z.number(),
    receive_currency: z.object({
      alias: Currency.AliasSchema,
      code: Currency.CodeSchema,
    }),
    write_off_amount: z.number(),
    write_off_currency: z.object({
      alias: Currency.AliasSchema,
      code: Currency.CodeSchema,
    }),
    shop: z.object({
      id: z.number(),
      name: z.string(),
    }),
  });

  export type Response = z.infer<typeof Schema>;
}
