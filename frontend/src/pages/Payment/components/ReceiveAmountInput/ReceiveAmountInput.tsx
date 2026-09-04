import {useTranslation} from "react-i18next";

import AmountInput from "@/components/AmountInput/AmountInput";
import WithLabel from "@/pages/ui/WithLabel";
import {formatThousands} from "@/utils";

import useGetPayment from "../../hooks/useGetPayment";
import type {Dispatch, State} from "../../hooks/usePaymentReducer";
import {hideAmount} from "../../utils";
import {getPlaceholder} from "./utils";

interface Props {
  state: State;
  getPayment: ReturnType<typeof useGetPayment>;
  dispatch: Dispatch;
}

const ReceiveAmountInput: React.FC<Props> = props => {
  const {state, getPayment, dispatch} = props;

  const {t} = useTranslation();
  return (
    <WithLabel label={t`amount_received_title`}>
      <AmountInput
        value={state.amount.type === "receive" ? state.amount.value : BigInt(0)}
        onChange={v =>
          dispatch({
            type: "ChangeAmount",
            payload: {
              type: "receive",
              value: v,
            },
          })
        }
        postfix={state.payway.currency || undefined}
        placeholder={
          state.amount.type !== "receive" &&
          state.amount.value &&
          !hideAmount(state, getPayment)
            ? `${getPayment.data!.receive_amount} ${state.payway.currency || ""}`
            : getPlaceholder(state.payway, t)
        }
        formater={formatThousands}
        testId="payment-receive-amount-input"
        bgColor="white dark:bg-dark-bg"
        disabled={state.amount.type !== "receive" && getPayment.isFetching}
        onFocus={() => {
          if (state.amount.type === "receive") {
            return;
          }

          dispatch({
            type: "ChangeAmount",
            payload: {
              type: "receive",
              value: BigInt(
                !getPayment.data
                  ? 0
                  : Math.floor(getPayment.data.receive_amount),
              ),
            },
          });
        }}
      />
    </WithLabel>
  );
};

export default ReceiveAmountInput;
