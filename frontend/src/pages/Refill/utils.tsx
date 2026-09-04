import {Currency, GetAccount, GetInputPaymethods} from "@/api/requests";
import {Option} from "@/components/SelectWallet/SelectWallet";
import {bigintToNumber} from "@/utils";
import {getGenericPaymethodIcon} from "@/utils/paymethodIcon";

import useGetDeposit from "./hooks/useGetDeposit";
import {State} from "./hooks/useRefillReducer";

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
    getDeposit.data.paymethod_id !== state.paymethod.id ||
    getDeposit.data.amount !== bigintToNumber(state.amount) ||
    getDeposit.data.payer_currency !== state.payway.code ||
    getDeposit.data.currency !== state.balance.code
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

export function balanceToOption(balance: GetAccount.Balance): Option<number> {
  return {
    ...balance,
    value: balance.id,
    title: Currency.getRuName(balance.code) ?? `${balance.alias}`,
    subtitle: `${balance.available} ${balance.alias}`,
    icon: Currency.getIcon(balance.alias)
      ? {
          icon: Currency.getIcon(balance.alias)!,
          bgColor: Currency.getColor(balance.alias) ?? "grey-400",
          color: "white",
        }
      : undefined,
    iconNode: !Currency.getIcon(balance.alias) ? (
      <div className="flex size-10 items-center justify-center rounded-4 bg-grey-400 text-white">
        {balance.alias}
      </div>
    ) : undefined,
  };
}

export function paymethodToOption(
  method: GetInputPaymethods.Paymethod,
): Option<number> {
  return {
    ...method,
    value: method.id,
    title: method.name,
    icon: {
      icon: getGenericPaymethodIcon(method.name),
      bgColor: "grey-200 dark:bg-dark-surface",
      color: "grey-600 dark:text-dark-text-primary",
      testId: `refill-paymethod-${method.id}-icon`,
    },
  };
}

