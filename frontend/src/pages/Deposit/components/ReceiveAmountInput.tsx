import {useTranslation} from "react-i18next";

import AmountInput from "@/components/AmountInput/AmountInput";
import WithLabel from "@/pages/ui/WithLabel";
import {formatThousands} from "@/utils";

import type {Dispatch, State} from "../hooks/useDepositReducer";
import useGetDeposit from "../hooks/useGetDeposit";
import {hideAmount} from "../utils";

interface Props {
  state: State;
  getDeposit: ReturnType<typeof useGetDeposit>;
  dispatch: Dispatch;
}

const ReceiveAmountInput: React.FC<Props> = props => {
  const {state, getDeposit, dispatch} = props;

  const {t} = useTranslation();
  return (
    <WithLabel label={t`transaction_history_detail_field_deposit_amount`}>
      <AmountInput
        value={state.amount}
        onChange={value =>
          dispatch({
            type: "ChangeAmount",
            payload: value,
          })
        }
        testId="deposit-receive-amount-input"
        postfix={state.balance.alias || undefined}
        placeholder={`0 ${state.balance.alias || ""}`}
        formater={formatThousands}
        bgColor="white dark:bg-dark-bg"
        hint={[
          // `Остаток лимита: ${formatThousands(state.balance.remainder ?? 0)} ${state.balance.alias || ""}`,
          t("recalculated_text_two", {
            minAmount: formatThousands(state.payway.min_amount),
            maxAmount: formatThousands(state.payway.max_amount),
            currency: state.payway.currency,
          }),
          t("recalculated_text_three", {
            balanceCurrency: state.balance.alias,
            amount: !hideAmount(state, getDeposit)
              ? getDeposit.data!.rate
              : "*",
            paymentCurrency: state.payway.currency,
          }),
        ].join("\n")}
      />
    </WithLabel>
  );
};

export default ReceiveAmountInput;
