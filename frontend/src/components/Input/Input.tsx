import React, {useRef, useState} from "react";
import InputMask, {ReactInputMask} from "react-input-mask";
import {twJoin, twMerge} from "tailwind-merge";

import {RegularCross, RegularEyeClosed, RegularEyeOpen} from "@/assets/icons";

const MASK_PLACEHOLDER = "_";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    "defaultValue" | "value" | "onChange"
  > {
  value: string;
  testId: string;
  label?: string;
  hint?: string;
  rows?: number;
  textArea?: boolean;
  postfix?: string;
  containerClassName?: string;
  error?: string;
  bgColor?: string;
  mask?: (string | RegExp)[];
  onChange: (value: string, maskedValue: string) => void;
}

const Input: React.FC<InputProps> = props => {
  const {
    value,
    testId,
    hint,
    postfix,
    containerClassName,
    error,
    label,
    bgColor = "grey-100 dark:bg-dark-underlay",
    mask,
    type: originalType,
    onChange,
    onMouseDown,
    onFocus,
    onBlur,
    textArea,
    disabled,
    readOnly,
    ...inputProps
  } = props;

  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const maskRef = useRef<ReactInputMask>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const type = passwordVisible ? "text" : originalType;

  const InputElement = textArea ? "textarea" : "input";

  const DynamicElement = React.createElement(InputElement, {
    ...inputProps,
    "data-testid": testId,
    ref: ref,
    value: value,
    disabled: disabled,
    readOnly: readOnly,
    className: twJoin(
      "w-full rounded-4 border-none pl-4 pr-14 font-p2 outline-none",
      !value || (value && !label) ? "py-5.5" : "pb-4 pt-7",
      !error ? `bg-${bgColor}` : "bg-rose-100 dark:bg-dark-red-bg",
      disabled
        ? "text-grey-300 dark:text-dark-neutral"
        : !value
          ? "text-grey-500 dark:text-dark-text-secondary"
          : "text-grey-600 dark:text-dark-text-primary",
      "text-p2",
      props.className,
    ),
    onChange: e => onChange(e.currentTarget.value, e.currentTarget.value),
    onMouseDown: onMouseDown,
    onFocus: (e: React.FocusEvent<HTMLInputElement, Element>) => {
      onFocus?.(e);
      setTimeout(
        () =>
          ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        100,
      );
    },
    onBlur: onBlur,
    type: type || "text",
  });

  return (
    <div className={twMerge("flex flex-col gap-2", containerClassName)}>
      <div className="flex flex-grow flex-col">
        <div className="relative w-full">
          {value && label && (
            <p
              className={twJoin(
                "absolute left-4 top-[14px] z-10 text-p4 font-p4 text-grey-500 dark:text-dark-text-secondary",
              )}>
              {label}
            </p>
          )}
          {mask ? (
            <InputMask
              ref={maskRef}
              mask={mask}
              value={value}
              maskPlaceholder={MASK_PLACEHOLDER}
              onChange={e =>
                onChange(
                  unmaskValue(e.currentTarget.value, mask),
                  e.currentTarget.value
                    .replaceAll(MASK_PLACEHOLDER, " ")
                    .trim(),
                )
              }
              onMouseDown={onMouseDown}
              onFocus={e => {
                onFocus?.(e);
                setTimeout(
                  () =>
                    ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    }),
                  100,
                );
              }}
              onBlur={onBlur}
              disabled={disabled}
              readOnly={readOnly}>
              <input
                data-testid={testId}
                {...inputProps}
                ref={ref as React.RefObject<HTMLInputElement>}
                className={twJoin(
                  "w-full rounded-4 border-none pl-4 pr-14 font-p2 outline-none",
                  !value || (value && !label) ? "py-5.5" : "pb-4 pt-7",
                  !error ? `bg-${bgColor}` : "bg-rose-100 dark:bg-dark-red-bg",
                  disabled
                    ? "text-grey-300 dark:text-dark-neutral"
                    : !value
                      ? "text-grey-500 dark:text-dark-text-secondary"
                      : "text-grey-600 dark:text-dark-text-primary",
                  "text-p2",
                  props.className,
                )}
                type={type}
              />
            </InputMask>
          ) : (
            DynamicElement
          )}
          {value && originalType !== "password" && (
            <button
              data-testid={`${testId}-reset-button`}
              className={twJoin(
                "absolute bottom-1/2 right-4 translate-y-1/2",
                disabled
                  ? "text-grey-300 dark:text-dark-neutral"
                  : "cursor-pointer text-grey-600 dark:text-dark-text-primary",
              )}
              onClick={() => onChange("", "")}>
              <RegularCross />
            </button>
          )}
          {originalType === "password" && value && (
            <button
              data-testid={`${testId}-reveal-button`}
              type="button"
              className={twJoin(
                "absolute bottom-1/2 right-4 translate-y-1/2",
                disabled
                  ? "text-grey-300 dark:text-dark-neutral"
                  : "cursor-pointer text-grey-600 dark:text-dark-text-primary",
              )}
              onClick={
                !disabled
                  ? () => setPasswordVisible(!passwordVisible)
                  : undefined
              }>
              {!passwordVisible ? <RegularEyeClosed /> : <RegularEyeOpen />}
            </button>
          )}
        </div>
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

export default Input;

function unmaskValue(value: string, mask: (string | RegExp)[] | ""): string {
  return value
    .split("")
    .map((char, i) => {
      const maskIth = mask.at(i);
      if (char === MASK_PLACEHOLDER || char === maskIth) {
        return "";
      }

      return char;
    })
    .join("");
}
