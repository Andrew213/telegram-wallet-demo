import {bigintToNumber} from "@/utils";

import useGetPayment from "./hooks/useGetPayment";
import {State} from "./hooks/usePaymentReducer";

export function hideAmount(
  state: State,
  getDeposit: ReturnType<typeof useGetPayment>,
) {
  return (
    !getDeposit.isSuccess ||
    getDeposit.isPending ||
    !getDeposit.data ||
    getDeposit.data.debouncedParams.paymethod_id !== state.paymethod.id ||
    getDeposit.data.debouncedParams.source_currency !== state.balance.code ||
    getDeposit.data.debouncedParams.target_currency !== state.payway.code ||
    getDeposit.data.debouncedParams.amount_type !== state.amount.type ||
    getDeposit.data.debouncedParams.amount !==
      bigintToNumber(state.amount.value)
  );
}

export function paymentDisabled(
  state: State,
  getDeposit: ReturnType<typeof useGetPayment>,
) {
  return (
    hideAmount(state, getDeposit) ||
    Object.values(state.payway.config).some(v => "valid" in v && !v.valid)
  );
}
