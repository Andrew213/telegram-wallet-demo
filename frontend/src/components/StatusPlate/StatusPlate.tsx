import {cloneElement, isValidElement, useEffect} from "react";
import {createPortal} from "react-dom";
import {useTranslation} from "react-i18next";
import {twMerge} from "tailwind-merge";

import {
  StatusError,
  StatusMail,
  StatusPending,
  StatusSuccess,
} from "@/assets/img/status";
import {useTheme} from "@/core/context/useTheme";
import {useFixPage} from "@/hooks";
import useSafePaddingTop from "@/hooks/useSafePaddingTop";

import Button from "../Button/Button";

interface Props {
  subTitle?: string | React.ReactNode;
  status: "PENDING" | "SUCCESS" | "ERROR" | "MAIL";
  title: string;
  testId: string;
  buttonText?: string;
  onButtonClick: () => void;
  onBackButtonClick?: () => void;
}

const StatusPlate: React.FC<Props> = props => {
  const {
    subTitle,
    status,
    title,
    testId,
    buttonText,
    onButtonClick,
    onBackButtonClick,
  } = props;

  const {t} = useTranslation();

  useFixPage();
  const Icon = {
    PENDING: StatusPending,
    SUCCESS: StatusSuccess,
    ERROR: StatusError,
    MAIL: StatusMail,
  }[status];

  useEffect(() => {
    if (onBackButtonClick) {
      const handleBackClick = () => {
        onBackButtonClick();
      };

      window.Telegram.WebApp.BackButton.onClick(handleBackClick);
      return () => {
        window.Telegram.WebApp.BackButton.offClick(handleBackClick);
      };
    }
  }, [onBackButtonClick]);

  const safePaddingTop = useSafePaddingTop();

  const [{isDark}] = useTheme();

  return createPortal(
    <div
      style={{
        paddingTop: safePaddingTop,
      }}
      className="fixed left-0 right-0 top-0 z-50 flex h-tg-viewport-height flex-col bg-white px-4 pb-4 dark:bg-dark-bg">
      {/* @ts-expect-error: Telegram.WebApp.isFullscreen might not exist */}
      {Telegram.WebApp.isFullscreen && !isDark && (
        <div
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 40px, #fff 40px, #fff 100%)",
            height: "100px",
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      )}
      <div className="flex-grow">
        <div className="mb-8 mt-30 flex justify-center">
          <img data-testid={`${testId}-status-plate-image`} src={Icon} />
        </div>
        <h3
          className="mb-4 text-center text-h3 font-h3 dark:text-dark-text-primary"
          data-testid={`${testId}-plate-title`}>
          {title}
        </h3>
        {isValidElement(subTitle) ? (
          cloneElement(subTitle as React.ReactElement, {
            "data-testid": `${testId}-status-plate-subtitle`,
          })
        ) : (
          <p
            className="whitespace-pre-line text-center text-p1 font-p1 text-grey-500 dark:text-dark-text-secondary"
            data-testid={`${testId}-status-plate-subtitle`}>
            {subTitle}
          </p>
        )}
      </div>
      <Button
        testId={`${testId}-status-plate-button`}
        size="lg"
        color="primary"
        onClick={onButtonClick}
        style={status === "MAIL" ? {borderRadius: 8} : {}}
        className={twMerge(
          status === "MAIL" &&
            "mb-[10px] h-[42px] max-w-[calc(100%-60px)] py-2",
          status === "MAIL" &&
            Telegram.WebApp.platform === "ios" &&
            "absolute -bottom-[18px] w-[calc(100%-100px)]",
        )}>
        {status === "MAIL" || status === "ERROR"
          ? t`lock_screen_button_label_user_blocked`
          : buttonText}
      </Button>
    </div>,
    document.body,
  );
};

export default StatusPlate;
