import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import sanitizeHtml from "sanitize-html";

import {GetAccount} from "@/api/requests";
import {
  RegularClock,
  RegularCross,
  RegularNotificationNo,
  RegularThumbUp,
} from "@/assets/icons";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {LS_MAIN_NOTIFICATION} from "@/constants";
import {useTheme} from "@/core/context/useTheme";
import {useOpenLink} from "@/hooks";
import {calculateTimeLeft} from "@/utils/calculateTimeLeft";

const getDeclension = (number: number, titles: [string, string, string]) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

interface Props {
  status: GetAccount.StatusName;
  tags:
    | {
        expired: string | null;
        name: string;
      }[]
    | [];
}

export const Notification: React.FC<Props> = props => {
  const {status, tags} = props;
  const {email_verified, verifying, verified, blocked} =
    GetAccount.AccountStatus;

  const [isNotificationHidden, setIsNotificationHidden] = useState<boolean>(
    !!localStorage.getItem(LS_MAIN_NOTIFICATION),
  );

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date()));

  const [{isDark}] = useTheme();

  const [isSupportOpened, setIsSupportOpened] = useState(false);
  const openLink = useOpenLink();

  const {t} = useTranslation();

  useEffect(() => {
    const deletedTag = tags.find(el => el.name === "DELETE_USER");
    if (deletedTag && deletedTag.expired) {
      const expirationDate = new Date(deletedTag.expired);

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(expirationDate));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [tags]);

  if (isNotificationHidden) {
    return null;
  }

  const renderNotice = () => {
    const deletedTag = tags.find(el => el.name === "DELETE_USER");
    if (tags.length && deletedTag) {
      const dayDeclension = getDeclension(timeLeft.days, [
        "день",
        "дня",
        "дней",
      ]);
      const hourDeclension = getDeclension(timeLeft.hours, [
        "час",
        "часа",
        "часов",
      ]);

      const translatedString = sanitizeHtml(
        t("badge_deleting_description.support", {
          email: "support@example.com",
        }),
      );

      return (
        <>
          {/* @ts-expect-error: Telegram.WebApp.isFullscreen might not exist */}
          {Telegram.WebApp.isFullscreen && !isDark && (
            <div
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 40px, #fff 40px, #fff 100%)",
                height: "100px", // Или другая высота, в зависимости от вашего дизайна
                width: "100%",
                position: "fixed", // Чтобы градиент всегда был вверху
                top: 0,
                left: 0,
                zIndex: 0, // Убедитесь, что он перекрывает другие элементы
              }}
            />
          )}
          <div
            className="flex size-10 items-center rounded-full bg-red-100 p-2 dark:bg-dark-red-bg"
            data-testid="notification-deleting-icon">
            <RegularNotificationNo className="text-red-300 dark:text-dark-red-text" />
          </div>
          <div>
            <p
              className="text-p1 font-p1 dark:text-dark-text-primary"
              data-testid="notification-deleting-title">{t`badge_deleting_title`}</p>
            <p
              className="text-p3 font-p3 dark:text-dark-text-primary"
              data-testid="notification-deleting-description">
              {timeLeft.days > 0 &&
                t("badge_deleting_description.days", {
                  count: timeLeft.days,
                  dayForm: dayDeclension,
                })}
              {timeLeft.hours > 0 &&
                t("badge_deleting_description.hours", {
                  count: timeLeft.hours,
                  hourForm: hourDeclension,
                })}{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: translatedString,
                }}
              />
            </p>
            <button
              onClick={() => {
                setIsSupportOpened(true);
              }}
              className="mt-4 rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1 dark:bg-dark-surface dark:text-dark-text-primary"
              data-testid="notification-deleting-button">
              {t`lock_screen_button_label_user_blocked`}
            </button>
          </div>
        </>
      );
    }
    if (status === email_verified) {
      return (
        <>
          <div
            className="flex size-10 items-center rounded-full bg-yellow-100 p-2 dark:bg-dark-yellow-bg"
            data-testid="notification-email-verified-icon">
            <RegularNotificationNo className="text-yellow-300 dark:text-dark-yellow-text" />
          </div>
          <div>
            <p
              className="text-p1 font-p1 dark:text-dark-text-primary"
              data-testid="notification-email-verified-title">{t`badge_email_verified_title`}</p>
            <p
              className="text-p3 font-p3 dark:text-dark-text-primary"
              data-testid="notification-email-verified-description">
              {t`badge_email_verified_description`}
            </p>
            <button
              onClick={() => {
                openLink("#demo-verification");
              }}
              className="mt-[22px] rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1 dark:bg-dark-surface dark:text-dark-text-primary"
              data-testid="notification-email-verified-button">
              {t`badge_email_verified_button_label`}
            </button>
          </div>
        </>
      );
    }
    if (status === verifying) {
      return (
        <>
          <div
            className="flex size-10 items-center rounded-full bg-yellow-100 p-2 dark:bg-dark-yellow-bg"
            data-testid="notification-verifying-icon">
            <RegularClock className="text-yellow-300 dark:text-dark-yellow-text" />
          </div>
          <div>
            <p
              className="text-p1 font-p1 dark:text-dark-text-primary"
              data-testid="notification-verifying-title">{t`badge_verifying_title`}</p>
            <p
              className="text-p3 font-p3 dark:text-dark-text-primary"
              data-testid="notification-verifying-description">{t`badge_verifying_description`}</p>
          </div>
        </>
      );
    }

    if (status === verified) {
      return (
        <>
          <div
            className="flex size-10 items-center rounded-full bg-green-100 p-2 dark:bg-dark-green-bg"
            data-testid="notification-verified-icon">
            <RegularThumbUp className="text-green-300 dark:text-dark-green-text" />
          </div>
          <div>
            <p
              className="text-p1 font-p1 dark:text-dark-text-primary"
              data-testid="notification-verified-title">{t`badge_verified_title`}</p>
            <p
              className="text-p3 font-p3 dark:text-dark-text-primary"
              data-testid="notification-verified-description">{t`badge_verified_description`}</p>
          </div>
        </>
      );
    }

    if (status === blocked) {
      return (
        <>
          <div
            className="flex size-10 items-center rounded-full bg-red-100 p-2 dark:bg-dark-red-bg"
            data-testid="notification-blocked-icon">
            <RegularNotificationNo className="text-red-300 dark:text-dark-red-text" />
          </div>
          <div>
            <p
              className="text-p1 font-p1 dark:text-dark-text-primary"
              data-testid="notification-blocked-title">{t`badge_blocked_title`}</p>
            <p
              className="text-p3 font-p3 dark:text-dark-text-primary"
              data-testid="notification-blocked-description">{t`badge_blocked_description`}</p>
            <button
              onClick={() => {
                setIsSupportOpened(true);
              }}
              className="mt-4 rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1 dark:bg-dark-surface dark:text-dark-text-primary"
              data-testid="notification-blocked-button">
              {t`badge_support_button_label`}
            </button>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <div className="flex items-start gap-2 rounded-8 bg-white p-4 dark:bg-dark-bg">
        {renderNotice()}
        {!isNotificationHidden && (
          <div className="ml-auto flex rounded-8 bg-white dark:bg-dark-bg">
            {(status !== blocked ||
              (status as GetAccount.StatusName) !== email_verified) && (
              <button
                onClick={() => {
                  localStorage.setItem(LS_MAIN_NOTIFICATION, "true");
                  setIsNotificationHidden(true);
                }}
                className="text-grey-500 dark:text-dark-text-secondary"
                data-testid="notification-hide-cross-button">
                <RegularCross />
              </button>
            )}
          </div>
        )}
      </div>
      {isSupportOpened && (
        <StatusPlate
          status="MAIL"
          title={t`support_title`}
          testId="notification"
          onBackButtonClick={() => setIsSupportOpened(false)}
          subTitle={
            <p className="text-center text-p1 font-p3 text-grey-500 dark:text-dark-text-secondary">
              {t`support_subtitle`}
            </p>
          }
          buttonText={t`write_to_telegram`}
          onButtonClick={() => {
            openLink("mailto:support@example.com");
          }}
        />
      )}
    </>
  );
};
export default Notification;
