import {useTranslation} from "react-i18next";
import {twJoin} from "tailwind-merge";

import Button from "@/components/Button/Button";
import Icon, {IconProps} from "@/components/Icon/Icon";
import SidePlate from "@/components/SidePlate/SidePlate";
import {useSystemMessage} from "@/core/context/useSystemMessage";

import Img, {ImgProps} from "../Img/Img";

export type ConfirmPlateField = {
  isId?: boolean;
  canBeCopied?: boolean;
  label: string;
  value: string;
  valueForCopying?: string;
};

type Props = {
  title: string;
  fields: ConfirmPlateField[];
  fieldSize: "sm" | "lg";
  confirmText: string;
  testId: string;
  subTitle?: string;
  close: () => void;
  onConfirm: () => void;
} & (
  | {icon?: IconProps["icon"]}
  | {img?: Pick<ImgProps, "src" | "alt">}
  | {iconNode?: React.ReactNode}
);

const ConfirmPlate: React.FC<Props> = props => {
  const {
    title,
    fields,
    fieldSize,
    confirmText,
    testId,
    subTitle,
    close: closeFromProps,
    onConfirm,
    ...restProps
  } = props;

  const [, setMessage] = useSystemMessage();

  const {t} = useTranslation();

  return (
    <SidePlate
      testId={`${testId}-confirm`}
      close={closeFromProps}
      bgColor="blue-300">
      {close => (
        <>
          <SidePlate.Header
            close={close}
            bgColor="blue-300"
            color="white"
            testId={`${testId}-confirm`}
            title={title}
          />

          <div className="flex flex-grow flex-col overflow-y-auto">
            <div className="flex flex-grow flex-col gap-6">
              <div className="mt-9 flex justify-center">
                {"icon" in restProps && restProps.icon && (
                  <Icon
                    icon={restProps.icon}
                    size="lg"
                    bgColor="white dark:bg-blue-300"
                    testId={`${testId}-confirm-plate-icon`}
                    color="blue-300 dark:text-dark-bg"
                  />
                )}
                {"img" in restProps && restProps.img && (
                  <div className="flex size-20 items-center justify-center rounded-8 bg-white dark:bg-dark-bg">
                    <Img
                      {...restProps.img}
                      size="lg"
                      data-testid={`${testId}-confirm-plate-image`}
                    />
                  </div>
                )}
                {"iconNode" in restProps ? restProps.iconNode : null}
              </div>
              <div className="flex flex-col justify-center gap-2">
                <h3
                  className="text-center text-h3 font-h3 text-white dark:text-dark-text-primary"
                  data-testid={`${testId}-confirm-plate-title`}>
                  {title}
                </h3>
                {subTitle && (
                  <p
                    className="text-center text-p2 font-p2 text-grey-200 dark:text-dark-text-primary"
                    data-testid={`${testId}-confirm-plate-subtitle`}>
                    {subTitle}
                  </p>
                )}
              </div>
              <div className="flex-grow rounded-t-8 bg-white px-4 pt-4 dark:bg-dark-bg">
                {fields.map((field, i) => (
                  <div
                    key={field.label}
                    className="flex border-grey-200 py-4 dark:border-dark-surface [&:not(:first-child)]:border-t">
                    <div
                      className="flex-grow"
                      data-testid={`${testId}-confirm-plate-${i}`}>
                      <p
                        style={{wordBreak: "break-word"}}
                        className={twJoin(
                          "mb-1 whitespace-pre-wrap text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary",
                          fieldSize === "lg" && "text-center",
                        )}>
                        {field.label}
                      </p>
                      <p
                        style={{wordBreak: "break-word"}}
                        data-testid={`${testId}-confirm-plate-${i}-text`}
                        className={twJoin(
                          "whitespace-pre-wrap text-grey-600 dark:text-dark-text-primary",
                          {
                            sm: "min-h-4.5 text-p3 font-p3",
                            lg: "text-center text-numbers font-numbers",
                          }[fieldSize],
                        )}>
                        {field.isId && field.value && "#"}
                        {field.value}
                      </p>
                    </div>
                    {field.canBeCopied && field.value && (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            field.valueForCopying ?? field.value,
                          );
                          setMessage(t`transaction_history_detail_clipboard`);
                        }}>
                        <Icon
                          icon="RegularCopy"
                          size="sm"
                          testId={`${testId}-confirm-plate-copy-icon`}
                          bgColor="white dark:bg-dark-bg"
                          color="grey-400 dark:text-dark-text-tertiary"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 dark:bg-dark-bg">
              <Button
                size="lg"
                color="primary"
                testId={`${testId}-confirm-plate-confirm-button`}
                onClick={() => {
                  close();
                  onConfirm();
                }}>
                {confirmText}
              </Button>
            </div>
          </div>
        </>
      )}
    </SidePlate>
  );
};

export default ConfirmPlate;
