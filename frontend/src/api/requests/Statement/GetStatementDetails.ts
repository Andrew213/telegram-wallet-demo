import {z} from "zod";

import {Currency} from "../shared";
import {GetStatements} from "./GetStatements";

export namespace GetStatementDetails {
  export const METHOD = "GET";
  export const getURL = (id: number) => `demo/statements/${id}`;
  export const QUERY_KEY = "GetStatementDetails";

  export type Params = {
    id: number;
    operation_type: number;
  };
  export const fields = [
    "id",
    "created",
    "amount",
    "currency",
    "currency.code",
    "currency.alias",
    "balance_amount",
    "is_deposit",
    "operation_class",
    "shop_operation_id",
  ];
  export type Fields = (typeof fields)[number];

  export const Schema = z.object({
    id: z.number(),
    created: z.number(),
    amount: z.number(),
    currency: z.object({
      alias: Currency.AliasSchema,
    }),
    balance_amount: z.number(),
    is_deposit: z.boolean(),
    operation_class: z.nativeEnum(
      GetStatements.operationClassNameToOperationClassCodeMap,
    ),
    shop_operation_id: z.string().nullable(),
  });

  export type Response = z.infer<typeof Schema>;
}
