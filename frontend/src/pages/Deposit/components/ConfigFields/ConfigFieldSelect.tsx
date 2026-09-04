import {useTranslation} from "react-i18next";

import SelectWallet from "@/components/SelectWallet/SelectWallet";
import {DEFAULT_LANGUAGE} from "@/constants";
import WithLabel from "@/pages/ui/WithLabel";

import useDepositReducer, {
  PaywayConfigFieldSelectWithValues,
} from "../../hooks/useDepositReducer";

interface Props {
  configField: PaywayConfigFieldSelectWithValues;
  configFieldKey: string;
  dispatch: ReturnType<typeof useDepositReducer>["1"];
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
        testId="deposit-config"
        value={{
          value: configField.value,
          title:
            configField.options.find(
              option => option.value === configField.value,
            )!.label?.[i18n.language] ||
            configField.options.find(
              option => option.value === configField.value,
            )!.label?.[DEFAULT_LANGUAGE],
        }}
        activeType="CHECK"
        title={title}
        hint={title}
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
