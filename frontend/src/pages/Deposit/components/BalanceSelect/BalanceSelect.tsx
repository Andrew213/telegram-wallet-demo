import {useTranslation} from "react-i18next";

import {GetAccount} from "@/api/requests";
import SelectWallet from "@/components/SelectWallet/SelectWallet";
import WithLabel from "@/pages/ui/WithLabel";

import type {Dispatch, State} from "../../hooks/useDepositReducer";
import {balanceToOption} from "./utils";

interface Props {
  state: State;
  balances: GetAccount.Balance[];
  dispatch: Dispatch;
}

const BalanceSelect: React.FC<Props> = props => {
  const {state, balances, dispatch} = props;

  const {t} = useTranslation();

  return (
    <WithLabel label={t`top_up_deposit_title`}>
      <SelectWallet
        testId="deposit-balance"
        value={balanceToOption(state.balance, t)}
        options={balances.map(el => balanceToOption(el, t))}
        onChange={v =>
          dispatch({
            type: "SelectBalance",
            payload: balances.find(o => o.id === v)!,
          })
        }
        activeType="OUTLINE"
        title={t`balance_selection_title`}
      />
    </WithLabel>
  );
};

export default BalanceSelect;
