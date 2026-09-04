import {useTranslation} from "react-i18next";

import Markup from "@/components/Markup/Markup";
import SelectCurrency from "@/components/SelectCurrency/SelectCurrency";
import {DEFAULT_LANGUAGE} from "@/constants";

import {
  addValuesToConfig,
  type Dispatch,
  type State,
} from "../../hooks/useDepositReducer";
import useGetPaywayInfoAndWarning from "./useGetPaywayInfoAndWarning";

interface Props {
  state: State;
  dispatch: Dispatch;
}

const PaywaySelect: React.FC<Props> = props => {
  const {state, dispatch} = props;

  const {t, i18n} = useTranslation();

  const getInfoAndWarning = useGetPaywayInfoAndWarning({
    info_id: state.payway.info_id,
    warning_id: state.payway.warning_id,
  });

  const warningText = getInfoAndWarning.data?.warning?.text;

  const infoText = getInfoAndWarning.data?.info?.text;

  return (
    <div className={"flex flex-col gap-4"}>
      <p className="px-4 text-p1 font-p1 text-grey-600 dark:text-dark-text-primary">{t`deposit_currency_title`}</p>
      <SelectCurrency
        testId="deposit-payway"
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
      {warningText && (
        <Markup
          data-testid="deposit-payway-warning-text"
          className="mx-4 whitespace-pre text-wrap break-words rounded-8 bg-rose-100 p-4 text-p3 font-p3 text-grey-600 dark:bg-dark-red-bg dark:text-dark-text-primary">
          {warningText[i18n.language] || warningText[DEFAULT_LANGUAGE]}
        </Markup>
      )}
      {infoText && (
        <Markup
          data-testid="deposit-payway-info-text"
          className="mx-4 whitespace-pre text-wrap break-words rounded-8 bg-yellow-100 p-4 text-p3 font-p3 text-grey-600 dark:bg-dark-yellow-bg dark:text-dark-text-primary">
          {infoText[i18n.language] || infoText[DEFAULT_LANGUAGE]}
        </Markup>
      )}
    </div>
  );
};

export default PaywaySelect;
