import {useTranslation} from "react-i18next";

import {GetAccount} from "@/api/requests";
import Spiner from "@/components/Spiner/Spiner";
import StatusPage from "@/components/StatusPage/StatusPage";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useOpenLink} from "@/hooks";
import {userError} from "@/utils";

import useGetAccount from "../hooks/useGetAccount";
import useGetPaymethods from "./hooks/useGetPaymethods";
import PaymentContent from "./PaymentContent";

const Payment: React.FC = () => {
  const openLink = useOpenLink();

  const [token] = useCloudStorage();

  const getAccount = useGetAccount(token);
  const getPaymethods = useGetPaymethods();

  const {t} = useTranslation();

  if (getAccount.data?.status === GetAccount.AccountStatus.blocked) {
    return (
      <StatusPage
        status="ERROR"
        title={t`lock_screen_title_user_blocked`}
        subTitle={t`lock_screen_subtitle_user_blocked`}
        testId="payment-error-block"
        button={{
          size: "lg",
          color: "primary",
          children: t`badge_support_button_label`,
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  if (getAccount.data?.status !== GetAccount.AccountStatus.verified) {
    return (
      <StatusPage
        status="LOCKED"
        title={t`lock_screen_title`}
        subTitle={t`lock_screen_subtitle`}
        testId="payment-locked"
        button={{
          size: "lg",
          color: "primary",
          children: t`lock_screen_button_label`,
          onClick: () => {
            openLink("#demo-verification");
          },
        }}
      />
    );
  }

  if (getAccount.error || getPaymethods.error) {
    return (
      <StatusPage
        status="ERROR"
        title={userError(getAccount.error || getPaymethods.error)}
        testId="payment-error"
        button={{
          size: "lg",
          color: "primary",
          children: t`badge_support_button_label`,
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  if (!getAccount.data || !getPaymethods.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spiner />
      </div>
    );
  }

  return (
    <PaymentContent
      balances={getAccount.data.balances}
      auth_operations={getAccount.data.auth_operations}
      paymethods={getPaymethods.data}
    />
  );
};

export default Payment;
