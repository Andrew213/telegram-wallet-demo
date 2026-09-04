import {useTranslation} from "react-i18next";

import AmountInput from "@/components/AmountInput/AmountInput";
import {getHint} from "@/pages/Payment/components/ReceiveAmountInput/utils";
import WithLabel from "@/pages/ui/WithLabel";
import {formatThousands} from "@/utils";

import useGetPayment from "../hooks/useGetPayment";
import type {Dispatch, State} from "../hooks/usePaymentReducer";
import {hideAmount} from "../utils";

interface Props {
  state: State;
  getPayment: ReturnType<typeof useGetPayment>;
  dispatch: Dispatch;
}

const WriteOffAmountInput: React.FC<Props> = props => {
  const {state, getPayment, dispatch} = props;

  const {t} = useTranslation();

  return (
    <WithLabel label={t`write_off_amount_title`}>
      <AmountInput
        value={
          state.amount.type === "write_off" ? state.amount.value : BigInt(0)
        }
        onChange={v =>
          dispatch({
            type: "ChangeAmount",
            payload: {
              type: "write_off",
              value: v,
            },
          })
        }
        postfix={state.balance.alias || undefined}
        placeholder={
          state.amount.type !== "write_off" &&
          state.amount.value &&
          !hideAmount(state, getPayment)
            ? `${getPayment.data!.write_off_amount} ${state.balance.alias || ""}`
            : t`deposit_amount_placeholder`
        }
        testId="payment-write-off-amount-input"
        formater={formatThousands}
        hint={getHint(state.payway, t)}
        bgColor="white dark:bg-dark-bg"
        disabled={state.amount.type !== "write_off" && getPayment.isFetching}
        onFocus={() => {
          if (state.amount.type === "write_off") {
            return;
          }

          dispatch({
            type: "ChangeAmount",
            payload: {
              type: "write_off",
              value: BigInt(
                !getPayment.data
                  ? 0
                  : Math.floor(getPayment.data.write_off_amount),
              ),
            },
          });
        }}
      />
    </WithLabel>
  );
};

export default WriteOffAmountInput;
