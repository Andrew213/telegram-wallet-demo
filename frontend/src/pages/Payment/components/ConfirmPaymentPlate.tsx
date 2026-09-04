import {useTranslation} from "react-i18next";

import {GetOutputPaymethods} from "@/api/requests";
import ConfirmPlate from "@/components/ConfirmPlate/ConfirmPlate";
import {DEFAULT_LANGUAGE} from "@/constants";
import {formatThousands} from "@/utils";
import {getGenericPaymethodIcon} from "@/utils/paymethodIcon";

import useGetPayment from "../hooks/useGetPayment";
import {State} from "../hooks/usePaymentReducer";

interface Props {
  state: State;
  getPaymentData: Exclude<ReturnType<typeof useGetPayment>["data"], undefined>;
  close: () => void;
  onConfirm: () => void;
}

const ConfirmPaymentPlate: React.FC<Props> = props => {
  const {state, getPaymentData, close, onConfirm} = props;

  const {t, i18n} = useTranslation();

  return (
    <ConfirmPlate
      close={close}
      icon={getGenericPaymethodIcon(state.paymethod.name)}
      title={state.paymethod.name}
      fields={[
        ...Object.values(state.payway.config).map(configField => {
          const getTitle = () => {
            if (typeof configField.title === "string") {
              return configField.title;
            } else {
              return (
                configField.title?.[i18n.language] ??
                configField.title?.[DEFAULT_LANGUAGE] ??
                configField.title?.en ??
                ""
              );
            }
          };
          return {
            canBeCopied: true,
            label: GetOutputPaymethods.isPaywayConfigFieldSelect(configField)
              ? (configField.titles?.[i18n.language] ??
                configField.titles?.[DEFAULT_LANGUAGE] ??
                configField.title ??
                "")
              : getTitle(),
            value: GetOutputPaymethods.isPaywayConfigFieldSelect(configField)
              ? configField.options.find(
                  option => option.value === configField.value,
                )!.label[i18n.language] ||
                configField.options.find(
                  option => option.value === configField.value,
                )!.label[DEFAULT_LANGUAGE]
              : configField.valueMasked,
            valueForCopying: GetOutputPaymethods.isPaywayConfigFieldSelect(
              configField,
            )
              ? configField.options.find(
                  option => option.value === configField.value,
                )!.label[i18n.language] ||
                configField.options.find(
                  option => option.value === configField.value,
                )!.label[i18n.language]
              : configField.value,
          };
        }),
        {
          label: t`amount_received_title`,
          value: `${formatThousands(getPaymentData.receive_amount)} ${state.payway.currency}`,
        },
        {
          label: t`transaction_history_detail_field_transfer_amount`,
          value: `${formatThousands(getPaymentData.write_off_amount)} ${state.balance.alias}`,
        },
        {
          label: t`transaction_history_detail_field_comment`,
          value: state.description,
        },
      ]}
      testId="payment"
      fieldSize="sm"
      confirmText={` ${t("to_transfer_label", {
        amount: formatThousands(getPaymentData.receive_amount),
      })} ${state.payway.currency}`}
      onConfirm={onConfirm}
    />
  );
};

export default ConfirmPaymentPlate;
