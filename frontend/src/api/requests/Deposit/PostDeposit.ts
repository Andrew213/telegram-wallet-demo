import {z} from "zod";

import {Currency} from "../shared";

export namespace PostDeposit {
  export const METHOD = "POST";
  export const URL = "demo/deposit";

  export type BodyRequired = {
    amount: number;
    currency: Currency.Code;
    paymethod_id: number;
    payer_currency: Currency.Code;
  };
  export type BodyOptional = Record<string, string>; // fields from config;

  export type Response = z.infer<typeof Schema>;

  export const Schema = z.object({
    id: z.number(),
    method: z.enum(["GET"]),
    url: z.string(),
    data: z.object({}),
    // data is some optional information could look like { language : "en", mdOrder : "85cd49c8-b830-4bc6-9a0a-c0c1c201ac44" }
  });
}
