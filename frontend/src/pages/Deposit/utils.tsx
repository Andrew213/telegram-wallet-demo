import {GetAccount, GetInputPaymethods} from "@/api/requests";
import {bigintToNumber} from "@/utils";

import {State} from "./hooks/useDepositReducer";
import useGetDeposit from "./hooks/useGetDeposit";

export function filterPaymethods(
  paymethods: GetInputPaymethods.Paymethod[],
  account: GetAccount.Account,
) {
  const accountIsVerified =
    account.status === GetAccount.AccountStatus.verified;
  const accountIsTrusted =
    account.is_trusted &&
    (account.status === GetAccount.AccountStatus.email_verified ||
      account.status === GetAccount.AccountStatus.verifying);
  const accountIsVerifiedOrTrusted = accountIsVerified || accountIsTrusted;

  return paymethods.filter(
    paymethod => accountIsVerifiedOrTrusted || !paymethod.verify_required,
  );
}

export function hideAmount(
  state: State,
  getDeposit: ReturnType<typeof useGetDeposit>,
) {
  return (
    !getDeposit.isSuccess ||
    getDeposit.isPending ||
    !getDeposit.data ||
    getDeposit.data.debouncedParams.paymethod_id !== state.paymethod.id ||
    getDeposit.data.debouncedParams.amount !== bigintToNumber(state.amount) ||
    getDeposit.data.debouncedParams.payer_currency !== state.payway.code ||
    getDeposit.data.debouncedParams.currency !== state.balance.code
  );
}

export function depositDisabled(
  state: State,
  getDeposit: ReturnType<typeof useGetDeposit>,
) {
  return (
    hideAmount(state, getDeposit) ||
    Object.values(state.payway.config).some(
      v => !GetInputPaymethods.isPaywayConfigFieldSelect(v) && !v.valid,
    )
  );
}
