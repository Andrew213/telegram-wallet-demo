import {useState} from "react";
import {useTranslation} from "react-i18next";

import {GetAccount, GetBills} from "@/api/requests";
import {RegularArrowRight, RegularReceipt} from "@/assets/icons";
import Spiner from "@/components/Spiner/Spiner";
import StatusPage from "@/components/StatusPage/StatusPage";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useOpenLink} from "@/hooks";
import {formatDateFromTimestamp, userError} from "@/utils";

import useGetAccount from "../hooks/useGetAccount";
import useGetBills from "../hooks/useGetBills";
import BillDetailed from "./components/BillDetailed";
import EmptyState from "./components/EmptyState";

const Bills: React.FC = () => {
  const [token] = useCloudStorage();

  const {
    data: bills,
    error,
    isSuccess,
    isLoading,
  } = useGetBills(token, {
    status: GetBills.statusNameToStatusCodeMap.Waiting,
  });
  const openLink = useOpenLink();

  const [encodedId, setEncodedId] = useState("");

  const getAccount = useGetAccount(token);

  const {status} = getAccount.data ?? {};

  const {i18n, t} = useTranslation();

  if (status === GetAccount.AccountStatus.blocked) {
    return (
      <StatusPage
        status="ERROR"
        title={t`lock_screen_title_user_blocked`}
        subTitle={t`lock_screen_subtitle_user_blocked`}
        testId="bills-error-block"
        button={{
          size: "lg",
          color: "primary",
          children: t`lock_screen_button_label_user_blocked`,
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-tg-viewport-height items-center justify-center dark:bg-dark-bg">
        <Spiner />
      </div>
    );
  }

  if (isSuccess && !bills.length) {
    return <EmptyState />;
  }

  if (error || getAccount.error) {
    return (
      <StatusPage
        status="ERROR"
        title={userError(error)}
        testId="bills-error"
        button={{
          size: "lg",
          color: "primary",
          children: t`lock_screen_button_label_user_blocked`,
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {bills?.map(
        ({id, expired, receive_amount, encoded_id, receive_currency}) => {
          const {day, month, year, hours, minutes} = formatDateFromTimestamp(
            expired,
            i18n.language,
          );
          return (
            <button
              data-testid={`bill-${id}-item`}
              className="flex items-center justify-start gap-4 rounded-8 bg-white p-4 dark:bg-dark-bg"
              onClick={() => {
                setEncodedId(encoded_id);
              }}
              key={id}>
              <div
                data-testid={`bill-${id}-icon`}
                className="relative self-start rounded-4 bg-grey-200 p-2 before:absolute before:right-0 before:top-0 before:size-2 before:rounded-full before:bg-red-300 dark:bg-dark-surface dark:text-dark-text-primary dark:before:bg-dark-red-text">
                <RegularReceipt />
              </div>
              <div className="flex flex-col gap-1 text-start">
                <p
                  data-testid={`bill-${id}-id`}
                  className="text-p1 font-p1 dark:text-dark-text-primary">
                  {id}
                </p>
                <p
                  className="text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary"
                  data-testid={`bill-${id}-expired`}>
                  {t("bill_bill_card_expire_text", {
                    expired: `${day}.${month}.${year} ${hours}:${minutes}`,
                  })}
                </p>
                <p
                  className="text-p3 font-p3 dark:text-dark-text-primary"
                  data-testid={`bill-${id}-amount`}>{`${receive_amount} ${receive_currency}`}</p>
              </div>
              <RegularArrowRight
                className="ml-auto dark:text-dark-text-primary"
                data-testid={`bill-${id}-arrow-right`}
              />
            </button>
          );
        },
      )}
      {encodedId && (
        <BillDetailed
          onClose={() => {
            setEncodedId("");
          }}
          encoded_id={encodedId}
        />
      )}
    </div>
  );
};

export default Bills;
