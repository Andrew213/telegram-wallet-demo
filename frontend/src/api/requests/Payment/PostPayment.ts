import {TFunction} from "i18next";
import {z} from "zod";

import {Currency} from "../shared";

export namespace PostPayment {
  export const METHOD = "POST";
  export const URL = "demo/payment";
  export type ResponseError = Error & {error_code: number};

  export const errorNameToErrorCodeMap = {
    invalidGcode: 1005,
  } as const;

  export const errorCodeToErrorNameMap = (t: TFunction) =>
    ({
      1005: t`initialization_errors.code_is_invalid`,
    }) as const;

  export type ErrorCode = keyof ReturnType<typeof errorCodeToErrorNameMap>;

  export type BodyRequired = {
    amount: number;
    amount_type: "receive" | "write_off";
    source_currency: Currency.Code;
    target_currency?: Currency.Code;
    description?: string;
    gcode?: string; // 2fa
  } & (
    | {
        paymethod_type: "bill";
        shop_id: number;
        shop_order_id: number;
      }
    | {
        paymethod_type: "payout";
        paymethod_id: number;
      }
    | {
        paymethod_type: "account_transfer";
        paymethod_id: number;
        // rest is in config, payee_account: string;
      }
  );
  export type BodyOptional = Record<string, string>; // fields from config;

  export const MAX_DESCRIPTION_LENGTH = 255;

  export type Params = never;

  export type Response = z.infer<typeof Schema>;

  export const Schema = z.object({
    receive_amount: z.number(),
    write_off_amount: z.number(),
  });
}
