import {TFunction} from "i18next";
import {z} from "zod";

import {Currency} from "../shared";

export namespace PutBillDetailed {
  export const METHOD = "PUT";

  export const statuses = (t: TFunction) => ({
    1: t`statuses.waiting`,
    2: t`statuses.successful`,
    3: t`statuses.rejected`,
    4: t`statuses.expired`,
  });

  export const getURL = (encoded_bill_id: string) =>
    `demo/bills/${encoded_bill_id}/authenticated`;

  const BillBalanceSchema = z.object({
    write_off_amount: z.number(),
    write_off_currency: z.object({
      alias: Currency.AliasSchema,
      code: Currency.CodeSchema,
    }),
  });

  export type BillBalance = z.infer<typeof BillBalanceSchema>;

  export enum BillStatus {
    Waiting = 1,
    Successful = 2,
    Rejected = 3,
    Expired = 4,
  }

  export const Schema = z.object({
    account: z.string(),
    allowed_balances: z.array(BillBalanceSchema).nullable(),
    status: z.nativeEnum(BillStatus),
    description: z.string(),
    expired: z.number(),
    id: z.number(),
    is_balance_allowed: z.boolean(),
    receive_amount: z.number(),
    receive_currency: z.union([
      z.object({
        alias: Currency.AliasSchema,
      }),
      Currency.AliasSchema,
    ]),
    shop_order_id: z.string(),
    write_off_amount: z.number(),
    write_off_currency: z.union([
      z.object({
        alias: Currency.AliasSchema,
      }),
      Currency.AliasSchema,
    ]),
  });

  export type BillDetailed = z.infer<typeof Schema>;

  export type Response = z.infer<typeof Schema>;
}
