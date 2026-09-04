import {z, ZodTypeAny} from "zod";

import {AVAILABLE_LANGUAGES} from "@/constants";

export namespace Locale {
  export const languages = AVAILABLE_LANGUAGES;
  export type Language = (typeof languages)[number];
  export const LanguageSchema = z.string();
  export const localized = <T extends ZodTypeAny>(schema: T) =>
    z.record(z.string(), schema);
}
