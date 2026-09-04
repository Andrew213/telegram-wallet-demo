import {useMemo} from "react";
import {useTranslation} from "react-i18next";

import {GetAccount} from "@/api/requests";
import Spiner from "@/components/Spiner/Spiner";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useOpenLink} from "@/hooks";
import {userError} from "@/utils";

import useGetAccount from "../hooks/useGetAccount";
import DepositContent from "./DepositContent";
import useGetPaymethods from "./hooks/useGetPaymethods";
import {filterPaymethods} from "./utils";

const Deposit: React.FC = () => {
  const [token] = useCloudStorage();

  const getAccount = useGetAccount(token);

  const getPaymethods = useGetPaymethods();

  const openLink = useOpenLink();

  const {t} = useTranslation();

  const filteredPaymethods = useMemo(() => {
    if (!getAccount.data || !getPaymethods.data) {
      return undefined;
    }

    return filterPaymethods(getPaymethods.data, getAccount.data);
  }, [getAccount.data, getPaymethods.data]);

  if (getAccount.data?.status === GetAccount.AccountStatus.blocked) {
    return (
      <StatusPlate
        status="ERROR"
        title={t`lock_screen_title_user_blocked`}
        subTitle={t`lock_screen_subtitle_user_blocked`}
        testId="deposit-error-block"
        onButtonClick={() => {
          openLink("mailto:support@example.com");
        }}
      />
    );
  }

  if (getAccount.error || getPaymethods.error) {
    return (
      <StatusPlate
        status="ERROR"
        title={userError(getAccount.error || getPaymethods.error)}
        testId="deposit-error"
        onButtonClick={() => {
          openLink("mailto:support@example.com");
        }}
      />
    );
  }

  if (!getAccount.data || !filteredPaymethods) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spiner />
      </div>
    );
  }

  return (
    <DepositContent
      status={getAccount.data.status}
      paymethods={filteredPaymethods}
      balances={getAccount.data.balances}
    />
  );
};

export default Deposit;
