import {TFunction} from "i18next";
import {z} from "zod";

import {safeObjectValues} from "@/utils";

import {Currency} from "../shared";

export namespace GetStatements {
  export const METHOD = "GET";
  export const URL = "demo/statements";
  export const QUERY_KEY = "GetStatements";

  export const operationClassNameToOperationClassCodeMap = {
    Deposit: 1,
    Withdraw: 2,
    System: 3,
  } as const;

  export const operationClassCodeToOperationClassNameMap = {
    1: "Deposit",
    2: "Withdraw",
    3: "System",
  } as const;

  export const operationClassNameToOperationClassNameRuMap = (t: TFunction) =>
    ({
      Deposit: t`operation_classes.deposit`,
      Withdraw: t`operation_classes.withdraw`,
      System: t`operation_classes.system`,
    }) as const;

  export const operationClassNames = safeObjectValues(
    operationClassCodeToOperationClassNameMap,
  );
  export type OperationClassName = (typeof operationClassNames)[number];

  export const operationClassCodes = safeObjectValues(
    operationClassNameToOperationClassCodeMap,
  );
  export type OperationClassCode = (typeof operationClassCodes)[number];

  export type Params = {
    id?: number;
    last_id?: number;
    created_from?: number;
    created_to?: number;
    operation_class?: OperationClassCode;
    currency?: Currency.Code;
    limit?: number;
  };

  const StatementSchema = z.object({
    id: z.number(),
    created: z.number(),
    amount: z.number(),
    balance_amount: z.number(),
    currency: Currency.AliasSchema,
    is_deposit: z.boolean(),
    operation_class: z.nativeEnum(operationClassNameToOperationClassCodeMap),
    operation_type: z.number(),
    shop_operation_id: z.string().nullable(),
  });
  export type Statement = z.infer<typeof StatementSchema>;

  export const Schema = z.array(StatementSchema);
  export type Response = z.infer<typeof Schema>;
}
