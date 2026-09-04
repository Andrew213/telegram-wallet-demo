import {useTranslation} from "react-i18next";

import SelectWallet from "@/components/SelectWallet/SelectWallet";
import WithLabel from "@/pages/ui/WithLabel";

import type {Dispatch, State} from "../../hooks/useDepositReducer";
import {paymethodToOption} from "./utils";

interface Props {
  state: State;
  dispatch: Dispatch;
}

const PaymethodSelect: React.FC<Props> = props => {
  const {state, dispatch} = props;

  const {t} = useTranslation();
  return (
    <WithLabel label={t`transaction_history_detail_field_paymethod`}>
      <SelectWallet
        value={paymethodToOption(state.paymethod)}
        options={state.paymethods.map(paymethodToOption)}
        testId="deposit-paymethod"
        onChange={v =>
          dispatch({
            type: "ChangePaymethod",
            payload: state.paymethods.find(p => p.id === v)!,
          })
        }
        activeType="CHECK"
        title={t`transaction_history_detail_field_paymethod`}
      />
    </WithLabel>
  );
};

export default PaymethodSelect;
