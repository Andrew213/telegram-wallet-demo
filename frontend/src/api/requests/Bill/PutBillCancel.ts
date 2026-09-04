import {z} from "zod";

export namespace PutBillCancel {
  export const METHOD = "PUT";
  export const getURL = (encoded_bill_id: string) =>
    `demo/bills/${encoded_bill_id}/cancel`;

  export const errorCodeToErrorTextMap = {
    7: "Bill is not found",
    14: "Incorrect account status",
  };

  export const Schema = z.object({
    shop_url: z.string().nullable().optional(),
  });
  export type Response = z.infer<typeof Schema>;
}
