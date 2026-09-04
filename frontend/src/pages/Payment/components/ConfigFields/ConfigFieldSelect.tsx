import {useTranslation} from "react-i18next";

import SelectWallet from "@/components/SelectWallet/SelectWallet";
import {DEFAULT_LANGUAGE} from "@/constants";
import WithLabel from "@/pages/ui/WithLabel";

import type {
  Dispatch,
  PaywayConfigFieldSelectWithValues,
} from "../../hooks/usePaymentReducer";

interface Props {
  configField: PaywayConfigFieldSelectWithValues;
  configFieldKey: string;
  dispatch: Dispatch;
}

const ConfigFieldSelect: React.FC<Props> = props => {
  const {configField, configFieldKey, dispatch} = props;

  const {i18n} = useTranslation();

  const title =
    configField.titles?.[i18n.language] ??
    configField.titles?.[DEFAULT_LANGUAGE] ??
    configField.title;

  return (
    <WithLabel label={title}>
      <SelectWallet
        options={configField.options.map(({value, label}) => ({
          value,
          title: label[i18n.language] ?? label[DEFAULT_LANGUAGE],
        }))}
        value={{
          value: configField.value,
          title:
            configField.options.find(
              option => option.value === configField.value,
            )!.label?.[i18n.language] ||
            configField.options.find(
              option => option.value === configField.value,
            )!.label[DEFAULT_LANGUAGE],
        }}
        testId="payment-config"
        activeType="CHECK"
        title={title}
        hint={
          configField.comment?.[i18n.language] ||
          configField.comment?.[DEFAULT_LANGUAGE]
        }
        onChange={value =>
          dispatch({
            type: "PatchPaywayConfigField",
            payload: {
              key: configFieldKey,
              configFieldPatch: {
                value,
              },
            },
          })
        }
      />
    </WithLabel>
  );
};

export default ConfigFieldSelect;
