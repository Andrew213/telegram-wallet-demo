import {useTranslation} from "react-i18next";

import SelectCurrency from "@/components/SelectCurrency/SelectCurrency";

import {
  addValuesToConfig,
  type Dispatch,
  type State,
} from "../hooks/usePaymentReducer";

interface Props {
  state: State;
  dispatch: Dispatch;
}

const PaywaySelect: React.FC<Props> = props => {
  const {state, dispatch} = props;

  const {t} = useTranslation();

  return (
    <div className={"flex flex-col gap-4"}>
      <p className="px-4 text-p1 font-p1 text-grey-600 dark:text-dark-text-primary">{t`recipient_currency_title`}</p>
      <SelectCurrency
        testId="payment-payway"
        currency={state.payway.code}
        currencies={state.paymethod.payways.map(p => ({
          code: p.code,
          alias: p.currency,
        }))}
        onChange={c =>
          dispatch({
            type: "ChangePayway",
            payload: addValuesToConfig(
              state.paymethod.payways.find(p => p.code === c)!,
            ),
          })
        }
      />
    </div>
  );
};

export default PaywaySelect;
