import {useTranslation} from "react-i18next";
import {Navigate} from "react-router-dom";
import {twJoin} from "tailwind-merge";

import {GetAccount} from "@/api/requests";
import {RegularCopy, RegularUser} from "@/assets/icons";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import useGetAccount from "@/pages/hooks/useGetAccount";

const Info: React.FC = () => {
  const [, setMessage] = useSystemMessage();

  const {t} = useTranslation();

  const [token] = useCloudStorage();

  const user = useGetAccount(token);

  if (!user?.data) {
    return <Navigate to={"/"} replace />;
  }

  const data = user.data;
  return (
    <>
      <div
        className="mb-4 flex size-16 items-center justify-center rounded-full bg-grey-200 dark:bg-dark-surface dark:text-dark-text-primary"
        data-testid="profile-info-avatar">
        <RegularUser />
      </div>
      <p
        className="mb-4 text-h3 font-h3 dark:text-dark-text-primary"
        data-testid="profile-info-email">
        {data.email}
      </p>
      <p
        className={twJoin(
          "mb-4 rounded-4 px-4 py-1 text-p2 font-p2",
          {
            1: "bg-red-100 text-red-300 dark:bg-dark-red-bg dark:text-dark-red-text",
            2: "bg-red-100 text-red-300 dark:bg-dark-red-bg dark:text-dark-red-text",
            3: "bg-green-100 text-green-300 dark:bg-dark-green-bg dark:text-dark-green-text",
            4: "bg-red-100 text-red-300 dark:bg-dark-red-bg dark:text-dark-red-text",
            5: "bg-yellow-100 text-yellow-300 dark:bg-dark-yellow-bg dark:text-dark-yellow-text",
          }[data.status],
        )}
        data-testid="profile-info-status">
        {GetAccount.getUserStatus(t)[data.status]}
      </p>
      <button
        type="button"
        data-testid="profile-info-account-number"
        onClick={() => {
          navigator.clipboard.writeText(`${data.account_number}`);
          setMessage(t`clipboard_for_account_number`);
        }}
        className="mb-[34px] flex items-center gap-2 text-grey-500 dark:text-dark-text-secondary">
        {data.account_number}
        <RegularCopy data-testid="profile-info-copy-icon" />
      </button>
    </>
  );
};

export default Info;
