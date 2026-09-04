import {cloneElement, isValidElement} from "react";
import {twJoin} from "tailwind-merge";

import {
  StatusError,
  StatusLocked,
  StatusPending,
  StatusSuccess,
} from "@/assets/img/status";
import {useHideHeaderContext} from "@/core/context/useHideHeader";
import useSafePaddingTop from "@/hooks/useSafePaddingTop";

import Button, {ButtonProps} from "../Button/Button";

interface Props {
  subTitle?: string | React.ReactNode;
  status: "PENDING" | "SUCCESS" | "ERROR" | "LOCKED";
  title: string;
  testId: string;
  button?: Omit<ButtonProps, "testId">;
  className?: string;
}

const StatusPage: React.FC<Props> = props => {
  const {subTitle, status, title, testId, button, className} = props;
  const [, useHideHeader] = useHideHeaderContext();
  useHideHeader(true);

  const safePaddingTop = useSafePaddingTop();

  const Icon = {
    PENDING: StatusPending,
    SUCCESS: StatusSuccess,
    ERROR: StatusError,
    LOCKED: StatusLocked,
  }[status];

  return (
    <>
      <div
        className={twJoin(
          "flex h-full flex-col bg-white px-4 pb-4 dark:bg-dark-bg",
          className,
        )}
        style={{
          paddingTop: safePaddingTop,
        }}>
        <div className="flex-grow">
          <div className="mb-8 mt-30 flex justify-center">
            <img data-testid={`${testId}-status-page-image`} src={Icon} />
          </div>
          <h3
            className="mb-4 text-center text-h3 font-h3 dark:text-dark-text-primary"
            data-testid={`${testId}-status-page-title`}>
            {title}
          </h3>
          {!subTitle ? null : isValidElement(subTitle) ? (
            cloneElement(subTitle as React.ReactElement, {
              "data-testid": `${testId}-status-page-subtitle`,
            })
          ) : (
            <p
              className="whitespace-pre-line text-center text-p1 font-p1 text-grey-500 dark:text-dark-text-secondary"
              data-testid={`${testId}-status-page-subtitle`}>
              {subTitle}
            </p>
          )}
        </div>
        {button && (
          <Button testId={`${testId}-status-page-button`} {...button} />
        )}
      </div>
    </>
  );
};

export default StatusPage;
