import {useTranslation} from "react-i18next";

import {parseMask} from "@/api/services/PaymethodService";
import Input from "@/components/Input/Input";
import {DEFAULT_LANGUAGE} from "@/constants";
import WithLabel from "@/pages/ui/WithLabel";

import useDepositReducer, {
  PaywayConfigFieldInputWithValues,
} from "../../hooks/useDepositReducer";

interface Props {
  configField: PaywayConfigFieldInputWithValues;
  configFieldKey: string;
  dispatch: ReturnType<typeof useDepositReducer>["1"];
}

const ConfigFieldInput: React.FC<Props> = props => {
  const {configField, configFieldKey, dispatch} = props;

  const {i18n, t} = useTranslation();

  const getTitle = () => {
    if (typeof configField.title === "string") {
      return configField.title;
    } else {
      return (
        configField.title?.[i18n.language] ||
        configField.title?.[DEFAULT_LANGUAGE] ||
        configField.title?.en
      );
    }
  };

  const label =
    configField.titles?.[i18n.language] ??
    configField.titles?.[DEFAULT_LANGUAGE] ??
    configField.label?.[i18n.language] ??
    configField.label?.[DEFAULT_LANGUAGE] ??
    "";

  return (
    <WithLabel label={label}>
      <Input
        value={configField.value}
        onChange={value =>
          dispatch({
            type: "PatchPaywayConfigField",
            payload: {
              key: configFieldKey,
              configFieldPatch: {
                value,
                valid:
                  (Boolean(value) &&
                    RegExp(configField.regex ?? "").test(value)) ||
                  configField.valid,
              },
            },
          })
        }
        placeholder={getTitle() || configField.example}
        type="text"
        bgColor="white dark:bg-dark-bg"
        hint={configField.comment?.[i18n.language] ?? configField.comment?.en}
        mask={parseMask(configField.mask)}
        testId="deposit-config-input"
        error={
          !configField.touched
            ? undefined
            : !configField.value
              ? t`common_errors.incorrect_data`
              : !configField.valid
                ? t`common_errors.incorrect_data`
                : undefined
        }
        onBlur={() =>
          dispatch({
            type: "PatchPaywayConfigField",
            payload: {
              key: configFieldKey,
              configFieldPatch: {
                touched: true,
                valid:
                  Boolean(configField.value) &&
                  RegExp(configField.regex ?? "").test(configField.value),
              },
            },
          })
        }
      />
    </WithLabel>
  );
};

export default ConfigFieldInput;
