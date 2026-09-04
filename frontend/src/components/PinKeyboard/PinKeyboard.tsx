import {isValidElement} from "react";
import {useTranslation} from "react-i18next";

import ArrowLeft from "./icons/ArrowLeft.svg";

interface Props {
  onChage?: (value: number | string) => void;
  onClear?: () => void;
  onReset?: () => void;
}

const PinKeyboard: React.FC<Props> = ({onChage, onClear, onReset}) => {
  const {t} = useTranslation();

  const keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [t`reset_label`, 0, <ArrowLeft key={245} />],
  ];

  return (
    <div
      className="mb-2 mt-auto flex flex-col items-center justify-center gap-4"
      data-testid="pincode-keyboard">
      {keys.map((row, index) => {
        return (
          <div className="flex items-center gap-12" key={index}>
            {row.map((el, i) => {
              if (typeof el === "string" && onReset) {
                return (
                  <button
                    key={i}
                    data-testid="pincode-key-reset"
                    onClick={() => {
                      onReset?.();
                    }}
                    className="size-16 rounded-4 text-p4 font-p4 text-grey-500 active:bg-grey-200 dark:text-dark-text-secondary dark:active:bg-dark-surface">
                    {el}
                  </button>
                );
              }
              return (
                <button
                  onClick={() => {
                    if (typeof el === "number") {
                      onChage?.(el);
                    } else if (isValidElement(el)) {
                      onClear?.();
                    }
                  }}
                  data-testid={
                    isValidElement(el)
                      ? "pincode-key-backspace"
                      : `pincode-key-${el}`
                  }
                  className="flex size-16 items-center justify-center rounded-4 text-numbers font-numbers text-grey-600 active:bg-grey-200 dark:text-dark-text-primary dark:active:bg-dark-surface"
                  key={i}>
                  {el}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PinKeyboard;
