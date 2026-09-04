import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";

import {Currency} from "@/api/requests";
import {RegularEyeClosed, RegularEyeOpen, RegularPlus} from "@/assets/icons";
import Button from "@/components/Button/Button";
import Spiner from "@/components/Spiner/Spiner";
import StatusPage from "@/components/StatusPage/StatusPage";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useOpenLink} from "@/hooks";
import {
  useUploadBills,
  useUploadDeposits,
  useUploadPayments,
} from "@/pages/Home/hooks/useFetchTransactions";
import {menuRoutes} from "@/routes";
import {userError} from "@/utils";

import useGetAccount from "../hooks/useGetAccount";
import Balance from "./components/Balance";
import Notification from "./components/Notification";
import TransactionsHistory from "./components/TransactionsHistory";

const Home: React.FC = () => {
  const [token] = useCloudStorage();

  const {data: account, isLoading, error, refetch} = useGetAccount(token);

  const {refetch: refetchDeposits} = useUploadDeposits(token);

  const {refetch: refetchPayments} = useUploadPayments(token);

  const {refetch: refetchBills} = useUploadBills(token);

  const [isEmptyHidden, setIsEmptyHidden] = useState(true);

  const {t} = useTranslation();

  const navigation = useNavigate();
  const openLink = useOpenLink();

  const [notEmptyBalanceId] = useState<undefined | number>(
    () => account && account.balances.find(el => el.available > 0)?.id,
  );

  const refetchAll = async () => {
    const response = await Promise.all([
      refetch(),
      refetchBills(),
      refetchDeposits(),
      refetchPayments(),
    ]);

    return response;
  };

  if (error || !account) {
    return (
      <StatusPage
        status="ERROR"
        title={userError(error)}
        subTitle={t`error_boundary_subtitle`}
        testId="home-error"
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
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spiner />
      </div>
    );
  }
  return (
    <PullToRefresh
      onRefresh={refetchAll}
      pullingContent={""}
      refreshingContent={<Spiner />}>
      <div className="flex h-full flex-col">
        <div
          data-scrollable-content
          className="flex flex-grow flex-col gap-4 overflow-y-auto p-4 pb-6">
          <Notification status={account.status} tags={account.tags} />
          <h3 className="text-h3 font-h3 dark:text-dark-text-primary">
            {t`main_balanes_title`}
          </h3>
          {account.balances
            .filter(balance => {
              if (isEmptyHidden) {
                if (notEmptyBalanceId) {
                  return balance.available > 0;
                } else {
                  return (
                    balance.code === Currency.nameToCodeMap.Euro ||
                    balance.code === Currency.nameToCodeMap.RussianRuble ||
                    balance.code === Currency.nameToCodeMap.USADollar
                  );
                }
              }
              return balance;
            })
            .map(balance => {
              return <Balance {...balance} key={balance.id} />;
            })}
          <button
            onClick={() => setIsEmptyHidden(prev => !prev)}
            className="mr-auto flex items-center gap-2 py-[10px] text-p2 font-p2 text-grey-500 dark:text-dark-text-secondary"
            data-testid="home-show-balances-button">
            {isEmptyHidden ? (
              <RegularEyeOpen className="dark:text-dark-text-secondary" />
            ) : (
              <RegularEyeClosed className="dark:text-dark-text-secondary" />
            )}

            {isEmptyHidden
              ? t`main_show_empty_balances`
              : t`main_hide_empty_balances`}
          </button>
          <Button
            onClick={() => {
              navigation(menuRoutes.deposit, {replace: true});
            }}
            testId="home-deposit-wallet-button"
            color="primary"
            size="lg">
            <RegularPlus />
            {t`main_deposit_wallet_button_label`}
          </Button>
        </div>
        <TransactionsHistory />
      </div>
    </PullToRefresh>
  );
};

export default Home;
