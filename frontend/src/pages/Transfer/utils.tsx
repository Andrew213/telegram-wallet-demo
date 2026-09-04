import {Currency, GetAccount, GetOutputPaymethods} from "@/api/requests";
import {Option} from "@/components/SelectWallet/SelectWallet";
import {bigintToNumber, formatThousands} from "@/utils";
import {getGenericPaymethodIcon} from "@/utils/paymethodIcon";

import useGetPayment from "./hooks/useGetPayment";
import {State} from "./hooks/useTransferReducer";

export function hideAmount(
  state: State,
  getDeposit: ReturnType<typeof useGetPayment>,
) {
  return (
    !getDeposit.isSuccess ||
    getDeposit.isPending ||
    !getDeposit.data ||
    getDeposit.data.paymethod_id !== state.paymethod.id ||
    getDeposit.data.source_currency !== state.balance.code ||
    getDeposit.data.target_currency !== state.payway.code ||
    getDeposit.data.amount_type !== state.amount.type ||
    getDeposit.data.amount !== bigintToNumber(state.amount.value)
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

export function paymethodToOption(
  paymethod: GetOutputPaymethods.Paymethod,
): Option<number> {
  return {
    ...paymethod,
    value: paymethod.id,
    title: paymethod.name,
    icon: {
      icon: getGenericPaymethodIcon(paymethod.name),
      bgColor: "grey-200 dark:bg-dark-surface",
      color: "grey-600 dark:text-dark-text-primary",
      testId: `transfer-paymethod-${paymethod.id}-icon`,
    },
  };
}

export function balanceToOption(balance: GetAccount.Balance): Option<number> {
  return {
    ...balance,
    value: balance.id,
    title: Currency.getRuName(balance.code) ?? balance.alias,
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

export function getReceiveInputPlaceholder(payway: GetOutputPaymethods.Payway) {
  return `Введите сумму от ${formatThousands(payway.min_amount)} до ${formatThousands(payway.max_amount)} ${payway.currency}`;
}

export function getReceiveInputHint(payway: GetOutputPaymethods.Payway) {
  const comissionFormula = !payway.fix
    ? `Комиссия ${payway.percent}%`
    : `Комиссия ${payway.percent}% + ${formatThousands(payway.fix)} ${payway.currency}`;
  const comissionMin = payway.min
    ? `, мин: ${formatThousands(payway.min)} ${payway.currency}`
    : "";
  const limits = `Вывод от ${formatThousands(payway.min_amount)} до ${formatThousands(payway.max_amount)} ${payway.currency}`;
  return `${comissionFormula}${comissionMin}\n${limits}`;
}

