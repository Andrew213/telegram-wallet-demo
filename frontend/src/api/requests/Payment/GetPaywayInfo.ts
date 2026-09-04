import {z} from "zod";

import {Locale} from "../shared";

export namespace GetPaywayInfo {
  export const METHOD = "GET";
  export const getURL = (info_id: number) => `demo/payway-info/${info_id}`;
  export const QUERY_KEY = "GetPaywayInfo";

  export type Params = never;

  export type Response = z.infer<typeof Schema>;

  export const Schema = z.object({
    text: Locale.localized(z.string()),
  });
}
