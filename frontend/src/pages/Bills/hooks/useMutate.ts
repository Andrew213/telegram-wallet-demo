import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {TFunction} from "i18next";

import {PutBillDetailed, PutBillPay} from "@/api/requests";
import BillService from "@/api/services/BillService";
import {ResponseError} from "@/api/types";

export const usePutBillDetailed = (): UseMutationResult<
  PutBillDetailed.Response,
  ResponseError,
  string,
  void
> => {
  return useMutation({
    mutationFn: (encoded_bill_id: string) =>
      BillService.putBillDetailed(encoded_bill_id).then(response => ({
        ...response,
        encoded_bill_id,
      })),
  });
};

export const usePutBillCancel = (): UseMutationResult<
  {shop_url?: string | null},
  ResponseError,
  string,
  void
> =>
  useMutation({
    mutationFn: (encoded_bill_id: string) =>
      BillService.putBillCancel(encoded_bill_id),
  });

export const usePutBillPay = (): UseMutationResult<
  {shop_url?: string | null},
  ResponseError,
  PutBillPay.Params & {t: TFunction},
  void
> =>
  useMutation({
    mutationFn: params =>
      BillService.putBillPay(
        {currency: params.currency, encoded_bill_id: params.encoded_bill_id},
        params.t,
      ),
  });
