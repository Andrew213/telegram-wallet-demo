import {TFunction} from "i18next";
import {z} from "zod";

import {Currency, Locale} from "../shared";

export namespace GetAccount {
  export const METHOD = "GET";
  export const URL = "demo/account";
  export const QUERY_KEY = "demo/account";

  export const paramValues = [
    "id",
    "email",
    "account_number",
    "status",
    "ip_list",
    "default_lang",
    "timezone",
    "birthdate",
    "use_api",
    "use_infodesk",
    "shop_transfer_enabled",
    "auth_methods",
    "auth_operations",
    "verification_method",
    "balances",
    "balances.code",
    "balances.alias",
    "balances.available",
    "balances.hold",
    "is_trusted",
    // "balances.remainder",
  ] as const;

  export const getUserStatus = (t: TFunction) => ({
    1: t`user_status.email_verified`,
    2: t`user_status.email_verified`,
    3: t`user_status.verified`,
    4: t`user_status.blocked`,
    5: t`user_status.verifying`,
  });

  export type StatusName = 1 | 2 | 3 | 4 | 5;
  export type ParamValue = (typeof paramValues)[number];

  export type Params = {
    param: ParamValue[];
  };

  // TODO скорректировать статусы
  export enum AccountStatus {
    new_account = 1,
    email_verified,
    verified,
    blocked,
    verifying,
  }

  export enum TwoFactorAction {
    AUTH = 2,
    SHOP_SETTINGS = 20,
    SHOP_INPUT_PAY_METHODS = 22,
    PAYMENTS = 38,
  }

  export enum TwoFactorType {
    NONE,
    GCODE,
  }
  const TwoFactorTypeSchema = z.nativeEnum(TwoFactorType);

  const BalanceSchema = z.object({
    id: z.number(),
    code: Currency.CodeSchema,
    alias: Currency.AliasSchema,
    available: z.number(),
    hold: z.number(),
    // remainder: z.number().nullable(),
    displayed: z.boolean(),
  });
  export type Balance = z.infer<typeof BalanceSchema>;

  const AuthMethodsSchema = z.object({
    1: z.boolean(), // If Google Authenticator is enabled
  });
  export type AuthMethods = z.infer<typeof AuthMethodsSchema>;

  const AuthOperationsSchema = z.object({
    2: TwoFactorTypeSchema, // What authorization method is enabled for login
    20: TwoFactorTypeSchema, // What authorization method is enabled for shop settings
    22: TwoFactorTypeSchema, // What authorization method is enabled for shop input paymethod payways
    38: TwoFactorTypeSchema, // What authorization method is enabled for payments
  });
  export type AuthOperations = z.infer<typeof AuthOperationsSchema>;

  const tagSchema = z.object({
    expired: z.string().nullable(),
    name: z.string(),
  });

  export const Schema = z.object({
    id: z.number(),
    email: z.string(),
    account_number: z.number(),
    status: z.nativeEnum(AccountStatus),
    ip_list: z.array(z.string()),
    default_lang: Locale.LanguageSchema,
    timezone: z.string(),
    birthdate: z.string().nullable(),
    // use_api: z.enum(["True", "False"]),
    use_infodesk: z.boolean(),
    shop_transfer_enabled: z.boolean(),
    auth_methods: AuthMethodsSchema,
    auth_operations: AuthOperationsSchema,
    verification_method: z.number(),
    balances: z.array(BalanceSchema),
    is_trusted: z.boolean(),
    tags: z.array(tagSchema),
  });

  export type Account = z.infer<typeof Schema>;
  export type Response = Account;
}
