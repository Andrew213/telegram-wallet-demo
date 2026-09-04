import {useState} from "react";
import {twJoin} from "tailwind-merge";

import {RegularArrowRight} from "@/assets/icons";

import Icon, {IconProps} from "../Icon/Icon";
import Img, {type ImgProps} from "../Img/Img";
import SidePlate from "../SidePlate/SidePlate";
import Wallet from "../Wallet/Wallet";

export type Option<T extends string | number> = {
  value: T;
  title: string;
  subtitle?: string;
} & (
  | {icon?: Omit<IconProps, "size">}
  | {img?: Omit<ImgProps, "size">}
  | {iconNode?: React.ReactNode}
);

interface Props<T extends string | number> {
  value: Option<T>;
  options: Option<T>[];
  activeType: "OUTLINE" | "CHECK";
  title: string;
  testId: string;
  hint?: string;
  disabled?: boolean;
  onChange: (optionValue: T) => void;
}

const SelectWallet = <T extends string | number>(props: Props<T>) => {
  const {value, options, activeType, testId, title, hint, disabled, onChange} =
    props;

  const [opened, setOpened] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div
          data-testid={`${testId}-select-wallet-item`}
          className={twJoin(
            "flex items-center gap-2 rounded-8 bg-white p-4 text-grey-600 dark:bg-dark-bg dark:text-dark-text-primary",
            !disabled && "cursor-pointer",
          )}
          onClick={!disabled ? () => setOpened(true) : undefined}>
          {"icon" in value && value.icon && <Icon {...value.icon} size="sm" />}
          {"img" in value && value.img && (
            <Img
              data-testid={`${testId}-select-wallet-image`}
              {...value.img}
              size="sm"
            />
          )}
          {"iconNode" in value && value.iconNode}
          <div className="flex flex-grow flex-col gap-1">
            <div
              className="text-p1 font-p1 text-grey-600 dark:text-dark-text-primary"
              data-testid={`${testId}-select-wallet-title`}>
              {value.title}
            </div>
            {value.subtitle && (
              <div
                className="text-p3 font-p3 text-grey-600 dark:text-dark-text-primary"
                data-testid={`${testId}-select-wallet-subtitle`}>
                {value.subtitle}
              </div>
            )}
          </div>
          <RegularArrowRight
            data-testid={`${testId}-select-wallet-arrow-right`}
          />
        </div>
        {hint && (
          <span
            data-testid={`${testId}-select-wallet-hint`}
            className={twJoin(
              "mx-4 whitespace-pre-wrap text-p4 font-p4",
              disabled
                ? "text-grey-300 dark:text-dark-text-tertiary"
                : "text-grey-400 dark:text-dark-text-tertiary",
            )}>
            {hint}
          </span>
        )}
      </div>
      {opened && (
        <SidePlate
          testId={`${testId}-select-wallet`}
          close={() => setOpened(false)}>
          {close => (
            <>
              <SidePlate.Header
                testId={`${testId}-select-wallet`}
                title={title}
                close={close}
              />
              <div className="flex flex-col gap-4 overflow-y-auto p-4">
                {options.map(option => (
                  <Wallet
                    key={option.value}
                    id={option.value}
                    testId={testId}
                    {...option}
                    active={option.value === value.value && activeType}
                    onClick={() => {
                      if (option.value !== value.value) {
                        onChange(option.value);
                      }
                      close();
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </SidePlate>
      )}
    </>
  );
};

export default SelectWallet;
