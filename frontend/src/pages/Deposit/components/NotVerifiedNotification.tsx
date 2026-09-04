import {useTranslation} from "react-i18next";

import {RegularNotificationNo} from "@/assets/icons";
import {useOpenLink} from "@/hooks";

const NotVerifiedNotification: React.FC = () => {
  const openLink = useOpenLink();
  const {t} = useTranslation();

  return (
    <div className="mx-4 flex items-start gap-2 rounded-8 bg-white p-4 dark:bg-dark-bg">
      <div className="flex size-10 items-center rounded-full bg-yellow-100 p-2 dark:bg-dark-yellow-bg">
        <RegularNotificationNo className="text-yellow-300 dark:bg-dark-yellow-text" />
      </div>
      <div>
        <p className="text-p1 font-p1 dark:text-dark-text-primary">{t`badge_email_verified_title`}</p>
        <p className="text-p3 font-p3 dark:text-dark-text-primary">{t`badge_email_verified_description`}</p>
        <button
          onClick={() => {
            openLink("#demo-verification");
          }}
          data-testid="deposit-not-verified-button"
          className="mt-[22px] rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1 dark:bg-dark-surface dark:text-dark-text-primary">
          {t`badge_email_verified_button_label`}
        </button>
      </div>
    </div>
  );
};

export default NotVerifiedNotification;
