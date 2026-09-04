import {useTranslation} from "react-i18next";

import {parseMask} from "@/api/services/PaymethodService";
import Input from "@/components/Input/Input";
import {DEFAULT_LANGUAGE} from "@/constants";
import WithLabel from "@/pages/ui/WithLabel";

import type {
  Dispatch,
  PaywayConfigFieldInputWithValues,
} from "../../hooks/usePaymentReducer";

interface Props {
  configField: PaywayConfigFieldInputWithValues;
  configFieldKey: string;
  dispatch: Dispatch;
}

const ConfigFieldInput: React.FC<Props> = props => {
  const {configField, configFieldKey, dispatch} = props;

  const {t, i18n} = useTranslation();

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
    getTitle() ??
    "";

  return (
    <WithLabel label={label}>
      <Input
        value={configField.value}
        onChange={(value, valueMasked) =>
          dispatch({
            type: "PatchPaywayConfigField",
            payload: {
              key: configFieldKey,
              configFieldPatch: {
                value,
                valueMasked,
                valid:
                  (Boolean(value) &&
                    RegExp(configField.regex ?? "").test(value)) ||
                  configField.valid,
              },
            },
          })
        }
        placeholder={configField.example}
        type="text"
        bgColor="white dark:bg-dark-bg"
        hint={
          configField.comment?.[i18n.language] ??
          configField.comment?.[DEFAULT_LANGUAGE]
        }
        mask={parseMask(configField.mask)}
        testId="payment-config-input"
        error={
          !configField.touched
            ? undefined
            : !configField.value
              ? t`common_errors.incorrect_data`
              : !configField.valid
                ? t`wrong_format`
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
