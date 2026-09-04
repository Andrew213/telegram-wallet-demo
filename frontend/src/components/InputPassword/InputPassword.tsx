import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {twJoin} from "tailwind-merge";

import {RegularSuccess} from "@/assets/icons";

import Input, {InputProps} from "../Input/Input";

interface Props extends Omit<InputProps, "onChange"> {
  onChange: (value: string) => void;
  getIsValid: (isVald: boolean) => void;
}

const InputPassword: React.FC<Props> = ({getIsValid, onChange, ...props}) => {
  const [password, setPassword] = useState("");

  const {t} = useTranslation();

  const [passwordRules, setPasswordRules] = useState([
    {
      text: t`validation_password_only_latin_characters`,
      reg: /[a-z]+/i,
      passed: false,
    },
    {
      text: t`validation_password_minimum_eight_characters`,
      reg: /^.{8,}$/i,
      passed: false,
    },
    {
      text: t`validation_password_one_capital_letter`,
      reg: /[A-Z]/,
      passed: false,
    },
    {
      text: t`validation_password_one_lowercase_letter`,
      reg: /[a-z]/,
      passed: false,
    },
    {
      text: t`validation_password_one_digit`,
      reg: /\d/,
      passed: false,
    },
  ]);

  useEffect(() => {
    const updatedRules = passwordRules.map(rule => ({
      ...rule,
      passed: rule.reg.test(password),
    }));
    setPasswordRules(updatedRules);
  }, [password]);

  useEffect(() => {
    getIsValid(passwordRules.every(rule => rule.passed));
  }, [getIsValid, passwordRules]);

  return (
    <>
      <Input
        type="password"
        label={t`password_placeholder`}
        placeholder={t`password_placeholder`}
        onChange={value => {
          setPassword(value);
          onChange?.(value);
        }}
        {...props}
      />
      <ul className="mt-4 flex flex-col gap-2">
        {passwordRules.map((rule, i) => {
          return (
            <li
              key={i}
              data-testid={`${props.testId}-rule-${i}`}
              className="flex gap-2">
              <RegularSuccess
                className={twJoin(
                  "size-4",
                  rule.passed
                    ? "text-green-300 dark:text-dark-green-text"
                    : "text-grey-300 dark:text-dark-neutral",
                )}
              />
              <p
                className="text-p3 font-p3 text-grey-600 dark:text-dark-text-primary"
                data-testid={`${props.testId}-rule-${i}-text`}>
                {rule.text}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default InputPassword;
