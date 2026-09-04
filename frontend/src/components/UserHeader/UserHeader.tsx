import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {RegularCopy, RegularSupport, RegularUser} from "@/assets/icons";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {useOpenLink} from "@/hooks";
import useGetAccount from "@/pages/hooks/useGetAccount";
import {authRoutes} from "@/routes";

import Spiner from "../Spiner/Spiner";
import StatusPlate from "../StatusPlate/StatusPlate";
import {cropEmail} from "./utils";

const UserHeader: React.FC = () => {
  const navigate = useNavigate();
  const openLink = useOpenLink();

  const [token] = useCloudStorage();

  const {data} = useGetAccount(token);

  const [, setMessage] = useSystemMessage();

  const [isSupportOpened, setIsSupportOpened] = useState(false);

  const {t} = useTranslation();

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spiner />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-b-8 bg-white px-4 pb-4 pt-2 dark:bg-dark-bg">
        <div className="flex flex-grow gap-2">
          <button
            data-testid="user-header-profile-button"
            onClick={() => {
              navigate(`/${authRoutes.profile}`);
            }}
            className="flex size-10 items-center justify-center rounded-4 bg-grey-200 text-grey-600 dark:bg-dark-surface dark:text-dark-text-primary">
            <RegularUser />
          </button>
          <div className="flex flex-col gap-0.5">
            <div
              className="text-h4 font-h4 text-grey-600 dark:text-dark-text-primary"
              data-testid="user-header-email-text">
              {cropEmail({email: data.email, maxLength: 35})}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${data.account_number}`);
                setMessage(t`clipboard_for_account_number`);
              }}
              data-testid="user-header-account-number-text"
              className="flex items-center gap-1 text-start text-p3 font-p3 text-grey-400 dark:text-dark-text-tertiary">
              {data.account_number}
              <RegularCopy
                data-testid="user-header-account-number-copy-button"
                className="size-4"
              />
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsSupportOpened(true)}
          className="h-6 w-6 text-grey-600 dark:text-dark-text-primary"
          data-testid="user-header-support-button">
          <RegularSupport />
        </button>
      </div>
      {isSupportOpened && (
        <StatusPlate
          status="MAIL"
          title={t`support_title`}
          testId="user-header"
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

export default UserHeader;
