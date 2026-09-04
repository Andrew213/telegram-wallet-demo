import {z} from "zod";

import {Currency, Locale} from "../shared";

export namespace GetInputPaymethods {
  export const METHOD = "GET";
  export const URL = "demo/input-paymethods";
  export const QUERY_KEY = "InputPaymethods";

  export type Params = never;

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
    id: z.number(),
    code: Currency.CodeSchema,
    currency: z.string(),
    config: z.record(z.string(), PaywayConfigFieldSchema),
    max_amount: z.number(),
    min_amount: z.number(),
    info_id: z.number().nullable(),
    warning_id: z.number().nullable(),
  });
  export type Payway = z.infer<typeof PaywaySchema>;

  const PaymethodSchema = z.object({
    id: z.number(),
    name: z.string(),
    payways: z.array(PaywaySchema),
    verify_required: z.boolean(),
  });
  export type Paymethod = z.infer<typeof PaymethodSchema>;

  export const Schema = z.array(PaymethodSchema);
  export type Response = z.infer<typeof Schema>;
}
