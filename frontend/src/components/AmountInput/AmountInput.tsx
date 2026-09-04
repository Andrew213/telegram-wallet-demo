import {useEffect, useRef, useState} from "react";
import {twJoin} from "tailwind-merge";

import {RegularCross} from "@/assets/icons";

export interface AmountInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "defaultValue" | "value" | "onChange" | "type"
  > {
  testId: string;
  value?: bigint;
  hint?: string;
  postfix?: string;
  error?: string;
  bgColor?: string;
  formater?: (n: bigint) => string;
  onChange?: (v: bigint) => void;
}

const NON_DIGITS_OR_LEADING_ZEROS_REGEX = /^0+|[^0-9]/g;

const AmountInput: React.FC<AmountInputProps> = props => {
  const {
    testId,
    value: valueFromProps,
    hint,
    postfix,
    error,
    bgColor = "grey-100",
    formater = n => n.toString(),
    onChange,
    disabled,
    ...inputProps
  } = props;

  const [value, setValue] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    if (valueFromProps === BigInt("0")) {
      setValue("");
    } else if (valueFromProps !== undefined) {
      setValue(formater(valueFromProps));
    }
  }, [valueFromProps, formater]);

  const handleChange = (value: string) => {
    const filteredValue = value.replace(NON_DIGITS_OR_LEADING_ZEROS_REGEX, "");
    if (!filteredValue) {
      onChange?.(BigInt("0"));
      setValue("");
    } else {
      const number = BigInt(filteredValue);
      onChange?.(number);
      setValue(formater(number));
    }
  };

  useEffect(() => {
    const calculateTextWidth = (text: string, font: string) => {
      if (!canvasRef.current) return 0;
      const context = canvasRef.current.getContext("2d");
      if (!context) return 0;
      context.font = font;
      return context.measureText(text).width;
    };

    if (inputRef.current) {
      const inputElement = inputRef.current;
      const computedStyle = window.getComputedStyle(inputElement);
      const font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      const width = calculateTextWidth(value, font);
      setTextWidth(width);
      setInputWidth(inputElement.offsetWidth);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex items-stretch rounded-4 bg-${!error ? bgColor : "rose-100 dark:bg-dark-red-bg"} px-4`}>
        <div
          className={
            "relative flex w-full items-center overflow-hidden py-5.5"
          }>
          <input
            data-testid={testId}
            {...inputProps}
            ref={inputRef}
            type="tel" // on iOS this type triggers number keybord
            value={value}
            onChange={e => handleChange(e.target.value)}
            disabled={disabled}
            className={twJoin(
              "w-full truncate bg-transparent text-p2 font-p2 outline-none",
              disabled
                ? "dark:text-dark-text-neutral text-grey-300"
                : !value
                  ? "text-grey-400 dark:text-dark-text-tertiary"
                  : "text-grey-600 dark:text-dark-text-primary",
            )}
            onFocus={e => {
              inputProps.onFocus?.(e);
              setTimeout(
                () =>
                  inputRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  }),
                100,
              );
            }}
          />
          <canvas ref={canvasRef} className="hidden" />
          {value && postfix && (
            <div
              className={twJoin(
                "invisible text-nowrap text-p2 font-p2",
                disabled
                  ? "text-grey-300 dark:text-dark-neutral"
                  : "text-grey-600 dark:text-dark-text-primary",
              )}>
              &nbsp;
              {postfix}
            </div>
          )}
          {value && postfix && (
            <span
              className={twJoin(
                "pointer-events-none absolute top-2/4 -translate-y-2/4 transform text-p2 font-p2",
                disabled
                  ? "text-grey-300 dark:text-dark-underlay"
                  : "text-grey-600 dark:text-dark-text-primary",
              )}
              style={{
                left: Math.min(textWidth, inputWidth),
              }}>
              &nbsp;
              {postfix}
            </span>
          )}
        </div>
        {value && (
          <div className="ml-1 flex flex-col justify-center">
            <button
              data-testid={`${testId}-reset-button`}
              disabled={disabled}
              className={
                disabled
                  ? "text-grey-300 dark:text-dark-neutral"
                  : "cursor-pointer text-grey-600 dark:text-dark-text-primary"
              }
              onClick={() => handleChange("")}>
              <RegularCross />
            </button>
          </div>
        )}
      </div>
      {error && (
        <span
          data-testid={`${testId}-error-text`}
          className="mx-4 text-p4 font-p4 text-rose-300 dark:text-dark-red-text">
          {error}
        </span>
      )}
      {hint && (
        <span
          data-testid={`${testId}-hint-text`}
          className={twJoin(
            "mx-4 whitespace-pre-wrap text-p4 font-p4",
            disabled
              ? "text-grey-300 dark:text-dark-neutral"
              : "text-grey-400 dark:text-dark-text-tertiary",
          )}>
          {hint}
        </span>
      )}
    </div>
  );
};

export default AmountInput;
