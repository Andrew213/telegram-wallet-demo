import {z} from "zod";

export namespace PostAccountTags {
  export const METHOD = "POST";
  export const URL = "demo/account/operation-availability";
  export const MUTATION_KEY = "demo/account/operation-availability";

  export enum OperationTypes {
    DEPOSIT = "deposit",
    BILL = "bill",
    PAYOUT = "payout",
    ACCOUNT_TRANSFER = "account_transfer",
  }

  export type Params = {
    account_id: number;
    operation_type: OperationTypes;
  };

  export const Schema = z.object({
    tag_limit_expires: z.string().nullable(),
    expired: z.boolean(),
  });

  export type AccountTags = z.infer<typeof Schema>;
  export type Response = AccountTags;
}
