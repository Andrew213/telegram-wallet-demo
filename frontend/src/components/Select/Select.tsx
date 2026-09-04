import {useEffect, useState} from "react";
import {twJoin} from "tailwind-merge";

import {RegularArrowDown, RegularArrowUp, RegularSuccess} from "@/assets/icons";

import BottomPlate from "../BottomPlate/BottomPlate";
import Button from "../Button/Button";
import Icon, {IconProps} from "../Icon/Icon";

export interface Option<T extends string | number> {
  value: T;
  title: string;
  subtitle?: string;
  icon?: Omit<IconProps, "size">;
  iconNode?: React.ReactNode;
}

interface Props<T extends string | number> {
  value: Option<T>;
  options: Option<T>[];
  title: string;
  testId: string;
  disabled?: boolean;
  changeTitle?: string;
  bgColor?: string;
  darkBgColor?: string;
  onChange: (optionValue: T) => void;
}

const Select = <T extends string | number>(props: Props<T>) => {
  const {
    value,
    options,
    title,
    testId,
    disabled,
    changeTitle,
    bgColor = "grey-100",
    darkBgColor = "dark-bg",
    onChange,
  } = props;

  const [unsavedValue, setUnsavedValue] = useState<T>(value.value);
  const [opened, setOpened] = useState(false);

  // reset unsaved value after close or after value changed
  useEffect(() => setUnsavedValue(value.value), [opened, value.value]);

  return (
    <>
      <div
        className={twJoin(
          `flex items-center gap-1 rounded-4 bg-${bgColor} dark:bg-${darkBgColor} px-4 py-5.5 text-p2 font-p2 text-grey-600 dark:text-dark-text-primary`,
          !disabled && "cursor-pointer",
        )}
        data-testid={`${testId}-select-trigger`}
        onClick={!disabled ? () => setOpened(true) : undefined}>
        <div className="flex-grow">{value.title}</div>
        {opened ? <RegularArrowUp /> : <RegularArrowDown />}
      </div>
      {opened && (
        <BottomPlate title={title} close={() => setOpened(false)}>
          {close => (
            <>
              <div className="overflow-y-auto">
                {options.map(option => {
                  return (
                    <div
                      key={option.value}
                      data-testid={`${testId}-select-option-${option.value}`}
                      className="flex cursor-pointer items-center gap-4 p-4 active:bg-grey-100 dark:active:bg-dark-surface"
                      onClick={() => {
                        if (changeTitle) {
                          setUnsavedValue(option.value);
                          return;
                        }

                        if (unsavedValue !== option.value) {
                          onChange(option.value);
                        }

                        close();
                      }}>
                      {option.icon && <Icon {...option.icon} size="sm" />}
                      {option.iconNode}
                      <div className="flex flex-grow flex-col gap-1">
                        <div
                          className="text-p3 font-p3 text-grey-600 dark:text-dark-text-primary"
                          data-testid={`${testId}-select-option-${option.value}-title`}>
                          {option.title}
                        </div>
                        {option.subtitle && (
                          <div
                            className="text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary"
                            data-testid={`${testId}-select-option-${option.value}-subtitle`}>
                            {option.subtitle}
                          </div>
                        )}
                      </div>
                      {option.value === unsavedValue && (
                        <div
                          className="text-green-200"
                          data-testid={`${testId}-select-option-${option.value}-selected`}>
                          <RegularSuccess />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {changeTitle && (
                <div className="p-4">
                  <Button
                    color="primary"
                    size="lg"
                    testId={`${testId}-select-confirm-button`}
                    onClick={() => {
                      onChange(unsavedValue);
                      close();
                    }}>
                    {changeTitle}
                  </Button>
                </div>
              )}
            </>
          )}
        </BottomPlate>
      )}
    </>
  );
};

export default Select;
