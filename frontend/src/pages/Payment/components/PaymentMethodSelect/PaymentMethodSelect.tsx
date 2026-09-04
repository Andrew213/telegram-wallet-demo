import {useTranslation} from "react-i18next";

import {GetOutputPaymethods} from "@/api/requests";
import SelectWallet from "@/components/SelectWallet/SelectWallet";
import WithLabel from "@/pages/ui/WithLabel";

import type {Dispatch, State} from "../../hooks/usePaymentReducer";
import {paymethodToOption} from "./utils";

interface Props {
  state: State;
  paymethods: GetOutputPaymethods.Paymethod[];
  dispatch: Dispatch;
}

const PaymentMethodSelect: React.FC<Props> = props => {
  const {state, paymethods, dispatch} = props;

  const {t} = useTranslation();

  return (
    <WithLabel label={t`output_payment_method_title`}>
      <SelectWallet
        value={paymethodToOption(state.paymethod)}
        options={paymethods.map(paymethodToOption)}
        testId="payment-paymethod"
        onChange={v =>
          dispatch({
            type: "ChangePaymethod",
            payload: paymethods.find(o => o.id === v)!,
          })
        }
        activeType="CHECK"
        title={t`output_payment_method_title`}
      />
    </WithLabel>
  );
};

export default PaymentMethodSelect;
