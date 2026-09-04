import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TFunction} from "i18next";

import {GetAccount} from "@/api/requests";
import PaymentService from "@/api/services/PaymentService";
import {bigintToNumber} from "@/utils";

import {State} from "./usePaymentReducer";

export default function usePostPayment(state: State) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {t: TFunction; gcode?: string}) =>
      PaymentService.postPayment({
        data: {
          amount: bigintToNumber(state.amount.value),
          amount_type: state.amount.type,
          source_currency: state.balance.code,
          target_currency: state.payway.code,
          paymethod_type: state.paymethod.is_transfer_paymethod
            ? "account_transfer"
            : "payout",
          paymethod_id: state.paymethod.id,
          description: state.description,
          gcode: vars.gcode,
        },
        config: Object.fromEntries(
          Object.entries(state.payway.config).map(([key, configFeild]) => [
            key,
            configFeild.value,
          ]),
        ),
        t: vars.t,
      }).then(async r => {
        await queryClient.invalidateQueries({queryKey: [GetAccount.QUERY_KEY]});
        return r;
      }),
  });
}
