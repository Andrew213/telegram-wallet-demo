import {z} from "zod";

import {Currency, Locale} from "../shared";

export namespace GetOutputPaymethods {
  export const METHOD = "GET";
  export const URL = "demo/output-paymethods";
  export const QUERY_KEY = "OutputPaymethods";

  export const paramValues = [
    "id",
    "name",
    "is_transfer_paymethod",
    "payways",
    "payways.id",
    "payways.code",
    "payways.currency",
    "payways.min_amount",
    "payways.max_amount",
    "payways.percent",
    "payways.fix",
    "payways.min",
    "payways.config",
    "payways.info_id",
  ] as const;
  export type ParamValue = (typeof paramValues)[number];

  export type Params = {
    param: ParamValue[];
  };

  const PaywayConfigFieldSchemaInput = z.object({
    type: z.union([z.literal("input"), z.literal("text")]).optional(),
    title: z.union([Locale.localized(z.string()), z.string()]).optional(),
    titles: Locale.localized(z.string()).optional(),
    label: Locale.localized(z.string()).optional(),
    comment: Locale.localized(z.string()).optional(),
    example: z.string().optional().optional(),
    regex: z.string().optional(),
    // prefix: z.string().optional(),
    mask: z.array(z.string()).optional(),
  });
  const PaywayConfigFieldSchemaSelectOption = z.object({
    value: z.string(),
    label: Locale.localized(z.string()),
  });
  const PaywayConfigFieldSchemaSelect = z.object({
    type: z.literal("select"),
    title: z.string(),
    titles: Locale.localized(z.string()).optional(),
    comment: Locale.localized(z.string()).optional(),
    options: z.array(PaywayConfigFieldSchemaSelectOption),
  });
  const PaywayConfigFieldSchema = z.union([
    PaywayConfigFieldSchemaInput,
    PaywayConfigFieldSchemaSelect,
  ]);

  export function isPaywayConfigFieldSelect(
    field: PaywayConfigField,
  ): field is PaywayConfigFieldSelect {
    return "type" in field && field.type === "select";
  }

  export type PaywayConfigFieldSelectOption = z.infer<
    typeof PaywayConfigFieldSchemaSelectOption
  >;
  export type PaywayConfigFieldInput = z.infer<
    typeof PaywayConfigFieldSchemaInput
  >;
  export type PaywayConfigFieldSelect = z.infer<
    typeof PaywayConfigFieldSchemaSelect
  >;
  export type PaywayConfigField = z.infer<typeof PaywayConfigFieldSchema>;

  const PaywaySchema = z.object({
    id: z.number().nullable(),
    code: Currency.CodeSchema,
    currency: Currency.AliasSchema,
    config: z.record(z.string(), PaywayConfigFieldSchema),
    fix: z.number(),
    percent: z.number(),
    max_amount: z.number(),
    min: z.number(),
    min_amount: z.number(),
    info_id: z.number().nullable(),
  });

  export type Payway = z.infer<typeof PaywaySchema>;

  const PaymethodSchema = z.object({
    id: z.number(),
    is_transfer_paymethod: z.boolean(),
    name: z.string(),
    payways: z.array(PaywaySchema),
  });
  export type Paymethod = z.infer<typeof PaymethodSchema>;

  export const Schema = z.array(PaymethodSchema);
  export type Response = z.infer<typeof Schema>;
}
