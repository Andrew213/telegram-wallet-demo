import {useTranslation} from "react-i18next";

import {Currency} from "@/api/requests";
import ConfirmPlate from "@/components/ConfirmPlate/ConfirmPlate";
import {bigintToNumber, formatThousands} from "@/utils";

import {State} from "../hooks/useDepositReducer";
import useGetDeposit from "../hooks/useGetDeposit";
import usePostDeposit from "../hooks/usePostDeposit";

interface Props {
  state: State;
  getDepositData: Exclude<ReturnType<typeof useGetDeposit>["data"], undefined>;
  close: () => void;
  postDeposit: ReturnType<typeof usePostDeposit>["mutate"];
}

const ConfirmDepositPlate: React.FC<Props> = props => {
  const {state, getDepositData, close, postDeposit} = props;

  const {t} = useTranslation();

  return (
    <ConfirmPlate
      close={close}
      {...(Currency.getIcon(state.balance.alias) !== undefined
        ? {
            icon: Currency.getIcon(state.balance.alias)!,
          }
        : {
            iconNode: (
              <div className="flex size-20 items-center justify-center rounded-8 bg-grey-400 text-h1 font-h1 text-white dark:bg-dark-text-tertiary dark:text-dark-bg">
                {state.balance.alias}
              </div>
            ),
          })}
      title={t`confirm_deposit_screen_deposit`}
      subTitle={
        Currency.getRuName(state.balance.code, t) ?? `${state.balance.alias}`
      }
      fields={[
        {
          label: t`payment_method_label`,
          value: state.paymethod.name,
        },
        {
          label: t`deposit_amount_title`,
          value: `${formatThousands(state.amount)} ${state.balance.alias}`,
        },
        {
          label: t`to_deposit_label`,
          value: `${formatThousands(getDepositData.amount)} ${getDepositData.currency}`,
        },
      ]}
      testId="deposit"
      fieldSize="lg"
      confirmText={`${t("to_pay_label", {amount: formatThousands(getDepositData.amount)})} ${getDepositData.currency}`}
      onConfirm={() => {
        postDeposit({
          data: {
            amount: bigintToNumber(state.amount),
            currency: state.balance.code,
            paymethod_id: state.paymethod.id,
            payer_currency: state.payway.code,
          },
          config: Object.fromEntries(
            Object.entries(state.payway.config).map(([key, configFeild]) => [
              key,
              configFeild.value,
            ]),
          ),
        });
      }}
    />
  );
};

export default ConfirmDepositPlate;
